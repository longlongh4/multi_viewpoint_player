import QtQuick 2.15

Item {
    property string title: ""
    default property alias placeHolderData: placeHolder.data
    property int currentAnimationIndex: 0
    property int animationsCount: 0
    property bool horizontalLineItemVisible: true

    Text {
        id: titleItem
        text: title
        font.bold: true
        font.pointSize: 30
    }

    Rectangle{
        id: horizontalLineItem
        anchors.top: titleItem.bottom
        anchors.topMargin: 2
        width: parent.width
        height: 1
        color: "darkgrey"
        visible: horizontalLineItemVisible
    }

    Item {
        id: placeHolder
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.topMargin: 4
        anchors.top: horizontalLineItem.bottom
        anchors.bottom: parent.bottom

        Component.onCompleted: {
            var count = 0
            for (var i = 0; i < resources.length; i++) {
                if ((resources[i] instanceof Animation) && resources[i].objectName.startsWith("animation")) {
                    count ++
                }
            }
            animationsCount = count
        }
    }



    //return -1 if all state has been displayed
    //return 0 if change state successfully
    function nextState() {
        if (animationsCount===0) {
            return -1
        }

        var animationItem = findAnimationItemByCurrentIndex()

        if (animationItem !== null && animationItem.running === true) {
            animationItem.complete()
            return 0
        }

        if (currentAnimationIndex < animationsCount) {
            currentAnimationIndex++
            var innerAnimationItem = findAnimationItemByCurrentIndex()
            if (innerAnimationItem === null){
                return -1
            }
            innerAnimationItem.start()
            return 0
        }
        return -1

    }

    function findAnimationItemByCurrentIndex() {
        var resources = placeHolder.resources
        for (var i = 0; i < resources.length; i++) {
            if ((resources[i] instanceof Animation) && resources[i].objectName === ("animation" + currentAnimationIndex)) {
                return resources[i]
            }
        }
        return null
    }
}
