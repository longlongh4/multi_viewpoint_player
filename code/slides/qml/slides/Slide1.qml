import QtQuick 2.15
import "../templates"

Slide {
    horizontalLineItemVisible: false
    Column{
        y: 200
        anchors.left: parent.left
        anchors.right: parent.right
        Text {
            text: qsTr("Multi Viewpoint Player")
            font.pointSize: 80
            font.bold: true
            anchors.left: parent.left
            anchors.right: parent.right
            horizontalAlignment: Text.AlignHCenter
        }
        Item{
            height: 100
        }

        Text {
            text: "Hailong"
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.leftMargin: 50
            anchors.rightMargin: 50
            horizontalAlignment: Text.AlignRight
            font.pointSize: 30
            font.italic: true
        }
    }
}
