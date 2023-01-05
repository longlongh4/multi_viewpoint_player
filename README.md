# Multi Viewpoint Plauer

A hackathon project to build a demo player to support multi-viewpoint playback.

## Project Objective

Build a demo web player like that.

![](./readme/project%20objective.gif)

## Steps

### Collect Video Resource

I don't have many cameras at home. So I tried to record 20 seconds of content from Youku to simulate nine cameras shooting the same content from different angles.

The recorded videos are encoded in AV1 and saved in IVF containers. Using IVF instead of MP4 containers could simplify the remux step to save time for the hackathon.

All videos are encoded in 24 fps with forced GOP at every second. So there will be a keyframe every 24 frames. All media source files are saved in `media_sources` folder.
