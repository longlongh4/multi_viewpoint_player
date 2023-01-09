import QtQuick 2.15

import "./templates"

Item {
    width: 1440
    height: 900

    signal nextSlideState()
    signal previousSlide()

    property int currentSlideIndex: 1
    property int slidesCount: 9

    onNextSlideState: {
        var result = loaderItem.item.nextState()
        if (result === -1) {
            currentSlideIndex >= slidesCount ? currentSlideIndex = currentSlideIndex : currentSlideIndex = currentSlideIndex + 1
        }
    }

    onPreviousSlide: currentSlideIndex <= 1 ? currentSlideIndex = currentSlideIndex : currentSlideIndex = currentSlideIndex - 1

    Rectangle{
        id: background
        anchors.fill: parent
        color: "white"
    }

    Loader{
        id: loaderItem
        anchors.fill: parent
        anchors.margins: 40
        source: "./slides/Slide"+ currentSlideIndex +".qml"
    }
}
