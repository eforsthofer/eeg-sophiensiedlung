YAML Transformer

Inputs:
    1. Original YAML file to transform
    2. Transformation YAML file, which contains all changes to be made to the original YAML file.
        

Outputs:
    Outputs the modified YAML file.

Assumptions:
    The algorithm assumes, that the transformation.yaml files is in the same format as the original file.

Special meaning in transformation YAML:
null in transormationYAML means: "only substitute when it occurs in original YAML"
example:

loadpoints:
  - title: null
    enable:
      delay: 0s
      threshold: 0
    disable:
      delay: 0s
      threshold: 0
    guardduration: 0s





