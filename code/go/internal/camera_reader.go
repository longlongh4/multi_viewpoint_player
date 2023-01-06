package internal

import (
	"io"
	"os"

	"github.com/longlongh4/multi_viewpoint_playerpackager/muxer/protos"
	"github.com/pion/webrtc/v3/pkg/media/ivfreader"
)

type CameraReader struct {
	file  *os.File
	angle float32
}

func (c *CameraReader) Open(url string, angle float32) error {
	file, err := os.Open(url)
	if err == nil {
		c.file = file
	}
	c.angle = angle
	return err
}

func (c CameraReader) ParseIndex() (*protos.Camera, error) {
	reader, header, err := ivfreader.NewWith(c.file)
	if err != nil {
		return nil, err
	}

	frames, err := readFrames(reader, int(header.NumFrames), int(header.TimebaseDenominator))
	if err != nil {
		return nil, err
	}
	camera := &protos.Camera{
		Frames:     frames,
		Angle:      c.angle,
		FrameCount: header.NumFrames,
		Width:      uint32(header.Width),
		Height:     uint32(header.Height),
		Framerate:  header.TimebaseDenominator,
		Timescale:  header.TimebaseNumerator,
		Codec:      header.FourCC,
	}
	return camera, nil
}

func readFrames(reader *ivfreader.IVFReader, numFrames int, framerate int) ([]*protos.Frame, error) {
	frames := make([]*protos.Frame, 0, numFrames)
	var offset uint64 = 0
	frameIndex := 0
	for {
		frame, header, err := reader.ParseNextFrame()
		if frame == nil && header == nil && err == io.EOF {
			return frames, nil
		} else if err != nil {
			return nil, err
		}
		frames = append(frames, &protos.Frame{
			Offset:    offset,
			Size:      header.FrameSize,
			Timestamp: header.Timestamp,
			Keyframe:  frameIndex%framerate == 0,
		})
		offset += uint64(header.FrameSize)
		frameIndex += 1
	}
}

func (c *CameraReader) Close() error {
	if c.file != nil {
		return c.file.Close()
	}
	return nil
}
