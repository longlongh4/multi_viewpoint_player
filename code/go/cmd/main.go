package main

import (
	"fmt"
	"io"
	"log"
	"os"

	"github.com/pion/webrtc/v3/pkg/media/ivfreader"
)

func readIVF(url string) *ivfreader.IVFReader {
	file, err := os.Open(url)
	if err != nil {
		log.Fatal("failed to open ivf file with error:", err)
	}
	reader, header, err := ivfreader.NewWith(file)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(header)
	return reader
}

func main() {
	reader := readIVF("../../media_sources/1.ivf")
	for {
		frame, header, err := reader.ParseNextFrame()
		if frame == nil && header == nil && err == io.EOF {
			break
		} else if err != nil {
			log.Fatal(err)
		}
		fmt.Print(header)
	}
}
