import QtQuick 2.15
import "../templates"

Slide {
    id: container
    title: "Different kinds of video"
    property int currentTab: 0

    ListModel {
        id: videos

        ListElement {
            name: "360 Degree Video"
        }
        ListElement {
            name: "Multi Viewpoint Video"
        }
        ListElement {
            name: "Volumetric Video"
        }
    }

    Row {
        id: tabbar
        height: 50
        Repeater{
            model: videos
            Rectangle{
                id: delegate
                height: parent.height
                width: container.width/3
                Text {
                    anchors.centerIn: parent
                    text: name
                }
                state: index === currentTab ? "clicked" : ""
                states: [
                    State {
                        name: "clicked"
                        PropertyChanges {
                            target: delegate
                            color: "#f5f6fa"
                        }
                    }
                ]
                MouseArea{
                    anchors.fill: parent
                    onClicked: currentTab = index
                }
            }
        }
    }

    Item {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        anchors.top: tabbar.bottom

        Item {
            anchors.fill: parent
            AnimatedImage {
                anchors.fill: parent
                anchors.margins: 50
                fillMode: Image.PreserveAspectFit
                source: "qrc:/qml/imgs/slide3/360 degree.gif"
            }
            visible: currentTab === 0
        }
        Item {
            anchors.fill: parent
            AnimatedImage {
                anchors.fill: parent
                anchors.margins: 50
                fillMode: Image.PreserveAspectFit
                source: "qrc:/qml/imgs/slide3/multiviewpoint.gif"
            }
            visible: currentTab === 1
        }
        Item {
            anchors.fill: parent
            AnimatedImage {
                anchors.fill: parent
                anchors.margins: 50
                fillMode: Image.PreserveAspectFit
                source: "qrc:/qml/imgs/slide3/volumetric.gif"
            }
            visible: currentTab === 2
        }
    }
}
