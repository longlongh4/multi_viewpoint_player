import QtQuick

import "qml"

Window {
    id: window
    visible: true
    width: 1440
    height: 900

    flags: Qt.WindowFullscreenButtonHint
    title: qsTr("Multi Viewpoint Player")

    MouseArea{
        anchors.fill: parent
        onClicked: presentation.nextSlideState()
    }

    Presentation{
        id: presentation
        focus: true
        anchors.centerIn: parent

        Keys.onLeftPressed: presentation.previousSlide()
        Keys.onRightPressed: presentation.nextSlideState()
        Keys.onUpPressed: presentation.previousSlide()
        Keys.onDownPressed: presentation.nextSlideState()
        Keys.onEscapePressed: window.showNormal()
    }

    onWidthChanged: {
        resizePresentation()
    }

    onHeightChanged: {
        resizePresentation()
    }

    function resizePresentation() {
        var winWidth = window.width
        var winHeight = window.height
        var ratioHeight = winWidth / 1440.0 * 900
        if (winHeight >= ratioHeight) {
            presentation.scale = ratioHeight / 900.0
        }else {
            presentation.scale = winHeight / 900.0
        }

    }
}
