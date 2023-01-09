import QtQuick 2.15

import "../templates"

Slide {
    title: "Background"
    property string imgUrl: ""

    ListModel {
        id: vrBrands

        ListElement {
            name: "Meta"
            logo: "qrc:/qml/imgs/slide2/meta.png"
            img: "qrc:/qml/imgs/slide2/metavr.webp"
        }
        ListElement {
            name: "Microsoft"
            logo: "qrc:/qml/imgs/slide2/ms.png"
            img: "qrc:/qml/imgs/slide2/msvr.jpg"
        }
        ListElement {
            name: "Apple"
            logo: "qrc:/qml/imgs/slide2/apple.png"
            img: "qrc:/qml/imgs/slide2/applevr.jpg"
        }
        ListElement {
            name: "Sony"
            logo: "qrc:/qml/imgs/slide2/Sony.png"
            img: "qrc:/qml/imgs/slide2/sonyvr.jpg"
        }
        ListElement {
            name: "Samsung"
            logo: "qrc:/qml/imgs/slide2/Samsungpng.png"
            img: "qrc:/qml/imgs/slide2/samsungvr.jpg"
        }
        ListElement {
            name: "HTC"
            logo: "qrc:/qml/imgs/slide2/htc.png"
            img: "qrc:/qml/imgs/slide2/htcvr.webp"
        }
    }

    Text {
        y: 20
        text: qsTr("The age of AR/VR/MR is coming. Different kinds of wearing devices are launching from time to time.")
        font.pointSize: 20
    }

    Column {
        id: column
        y: 100
        spacing: 8
        Repeater{
            model:vrBrands
            Rectangle {
                id: delegate
                width: 300
                height: 100

                states: [
                    State {
                        name: "hovor"
                        PropertyChanges {
                            target: delegate
                            color: "#f5f6fa"
                        }
                    }
                ]

                MouseArea{
                    anchors.fill: parent
                    hoverEnabled: true
                    onContainsMouseChanged: {
                        if(containsMouse) {
                            delegate.state = "hovor"
                            imgUrl = img
                        } else {
                            delegate.state = ""
                            imgUrl = ""
                        }
                    }
                }

                Row {
                    spacing: 60
                    height: parent.height
                    Text {
                        text: name
                        font.pointSize: 30
                        height: parent.height
                        width: 140
                        verticalAlignment: Text.AlignVCenter
                    }

                    Image {
                        source: logo
                        width: 80
                        height: 100
                        fillMode: Image.PreserveAspectFit
                    }
                }
            }
        }
    }

    Image {
        id: productImg
        anchors.left: column.right
        anchors.top: column.top
        anchors.bottom: column.bottom
        anchors.right: parent.right
        anchors.leftMargin: 50
        fillMode: Image.PreserveAspectFit
        source: imgUrl
    }
}
