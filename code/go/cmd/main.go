package main

import (
	"encoding/binary"
	"io"
	"log"
	"os"

	"github.com/longlongh4/multi_viewpoint_playerpackager/muxer/internal"
	"github.com/longlongh4/multi_viewpoint_playerpackager/muxer/protos"
	"github.com/pion/webrtc/v3/pkg/media/ivfreader"
	"google.golang.org/protobuf/proto"
)

var cameraDescriptors = []cameraDescriptor{
	{url: "../../media_sources/1.ivf", angle: 0},
	{url: "../../media_sources/2.ivf", angle: 10},
	{url: "../../media_sources/3.ivf", angle: 20},
	{url: "../../media_sources/4.ivf", angle: 45},
	{url: "../../media_sources/5.ivf", angle: 60},
	{url: "../../media_sources/6.ivf", angle: -10},
	{url: "../../media_sources/7.ivf", angle: -20},
	{url: "../../media_sources/8.ivf", angle: -45},
	{url: "../../media_sources/9.ivf", angle: -60},
}

type cameraDescriptor struct {
	url   string
	angle float32
}

type fileHeader struct {
	Magic       string
	Version     uint16
	IndexLength uint32
}

func parseCameraIndex(url string, angle float32) (*protos.Camera, error) {
	cameraReader := &internal.CameraReader{}
	defer cameraReader.Close()
	if err := cameraReader.Open(url, angle); err != nil {
		log.Fatal("failed to open file.", err)
	}
	return cameraReader.ParseIndex()
}

func buildCameras(cameraDescriptors []cameraDescriptor) []*protos.Camera {
	cameras := []*protos.Camera{}
	for _, cameraDescriptor := range cameraDescriptors {
		camera, err := parseCameraIndex(cameraDescriptor.url, cameraDescriptor.angle)
		if err != nil {
			log.Fatal("errer when generating camera index", err)
		}
		cameras = append(cameras, camera)
	}
	return cameras
}

func buildIndex(cameras []*protos.Camera) *protos.Index {
	var offset uint64 = 0
	for _, camera := range cameras {
		for _, frame := range camera.Frames {
			frame.Offset = offset
			offset += uint64(frame.Size)
		}
	}
	index := &protos.Index{Cameras: cameras, CameraCount: uint32(len(cameras))}
	return index
}

func buildMediaBody(cameraDescriptors []cameraDescriptor, outputFile *os.File) {
	checkError := func(err error) {
		if err != nil {
			log.Fatal(err)
		}
	}
	for _, cameraDescriptor := range cameraDescriptors {
		file, err := os.Open(cameraDescriptor.url)
		checkError(err)
		reader, _, err := ivfreader.NewWith(file)
		checkError(err)
		for {
			frame, header, err := reader.ParseNextFrame()
			if frame == nil && header == nil && err == io.EOF {
				break
			}
			checkError(err)
			outputFile.Write(frame)
		}
		file.Close()
	}
}

func generateMedia(cameraDescriptors []cameraDescriptor, output string) {
	cameras := buildCameras(cameraDescriptors)
	index := buildIndex(cameras)
	indexBody, err := proto.Marshal(index)
	if err != nil {
		log.Fatal("error when Marshal media index", err)
	}
	fileHeader := fileHeader{
		Magic:       "MVVF",
		Version:     0,
		IndexLength: uint32(len(indexBody)),
	}

	file, err := os.OpenFile(output, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0666)
	if err != nil {
		log.Fatal("error open output file", err)
	}
	defer file.Close()
	binary.Write(file, binary.LittleEndian, []byte(fileHeader.Magic))
	binary.Write(file, binary.LittleEndian, fileHeader.Version)
	binary.Write(file, binary.LittleEndian, fileHeader.IndexLength)
	binary.Write(file, binary.LittleEndian, indexBody)
	buildMediaBody(cameraDescriptors, file)
}

func main() {
	generateMedia(cameraDescriptors, "out.mvv")
}
