import { Field, FieldMapping } from "../types/ImportCongurations";

export function configurationFieldMappingConvertor(
  fieldMappings: FieldMapping[]
): Field[] {
  var Fields: Field[] = [];

  for (var i = 0; i < fieldMappings.length; i++) {
    var cField = fieldMappings[i];
    let currentField: any = {};
    currentField.id = cField.position;
    currentField.name = cField.name;
    currentField.options = cField.validValues;
    currentField.order = cField.position;
    currentField.dataType = cField.dataType;
    currentField.textRange = cField.replaceValue;
    currentField.dateFormat = cField.datePattern;
    currentField.dateSeperator = cField.multiValue_delimiter;
    currentField.source = cField.source;
    Fields[i] = currentField;
  }
  // fieldMappings.forEach((cField) => {
  //     currentField =intialField;
  //     currentField.name = cField.name;
  //     currentField.options = cField.validValues;
  //     currentField.order = cField.position;
  //     currentField.type = cField.type;
  //     currentField.textRange = cField.replaceValue;
  //     currentField.dateFormat = cField.datePattern;
  //     currentField.dateSeperator = cField.multiValue_delimiter;
  //     Fields.push(currentField);
  //    });
  return Fields;
}
