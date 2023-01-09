import QtQuick 2.15
import "../templates"
Slide {
    title: "Demo"
    AnimatedImage {
        anchors.fill: parent
        anchors.margins: 50
        source: "qrc:/qml/imgs/demo.gif"
        fillMode: Image.PreserveAspectFit
    }
    Text {
        onLinkActivated: Qt.openUrlExternally("https://longlongh4.github.io/multi_viewpoint_player/")
        text: '<html><style type="text/css"></style><a href="https://longlongh4.github.io/multi_viewpoint_player/">https://longlongh4.github.io/multi_viewpoint_player/</a></html>'
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 10
    }
}
