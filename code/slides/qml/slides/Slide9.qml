import QtQuick 2.15

import "../templates"
import QtQuick.Particles 2.15
Slide {
   title: "Thank you"
   Item {
           width: 500
           height: 500
           anchors.horizontalCenter: parent.horizontalCenter
           y: 50
           ParticleSystem {
               width: 500
               height: 500
               anchors.centerIn: parent

               ImageParticle {
                   source: "qrc:/qml/imgs/particle.png"
                   z: 2
                   anchors.fill: parent
                   color: "blue"
                   alpha: 1
                   colorVariation: 0.5
               }

               Emitter {
                   anchors.fill: parent
                   emitRate: 9000
                   lifeSpan: 720
                   size: 10
                   shape: MaskShape {
                       source: "qrc:/qml/imgs/starfish_mask.png"
                   }
               }
           }
       }

       Text {
           id: others
           anchors.horizontalCenter: parent.horizontalCenter
           y: 600
           font.pointSize: 100
           font.bold: true
           color: "black"
           text: "Hailong"
       }
}
