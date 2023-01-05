meta:
  id: mvv
  title: Multi-ViewPoint Video
  file-extension: mvv
  endian: le
doc: |
  A new media container for multi-viewpoint video streams.
seq:
  - id: magic
    contents: MVVF
    doc: Multi-ViewPoint Video File tag
  - id: version
    type: u2
    doc: This should be 0
  - id: len_index_body
    type: u4
  - id: index_body
    size: len_index_body
    doc: protobuf encoded media index binary data
