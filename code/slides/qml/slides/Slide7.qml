import QtQuick 2.15

import "../templates"
Slide {
    id: slide6
    title: "Video Frames"

    property real cellWidth: slide6.width/9
    property real cellHeight: cellWidth/360*202
    Grid{
        anchors.fill: parent
        columns: 9
        Repeater{
            model: 81
            delegate: Item{
                id: img
                width: cellWidth
                height: cellHeight
                states: [
                    State {
                        name: "hovor"
                        PropertyChanges {
                            target: img
                            scale: 1.8
                            z: 10
                        }
                    }
                ]
                Image {
                    source: `qrc:/qml/imgs/slide6/${Math.floor(index/9)+1}_${index%9+1}.jpg`
                    fillMode: Image.PreserveAspectFit
                    anchors.fill: parent
                    anchors.margins: 5
                }
                MouseArea{
                     anchors.fill: parent
                     hoverEnabled: true
                     onContainsMouseChanged: {
                         if(containsMouse) {
                             img.state = "hovor"
                         } else {
                             img.state = ""
                         }
                     }
                 }
            }
        }
    }
}
