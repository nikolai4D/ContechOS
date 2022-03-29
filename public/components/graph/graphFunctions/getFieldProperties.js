export default function (valueOfAttribute, fieldProperties) {
    let type = [];
    if (valueOfAttribute?.fieldProperties && valueOfAttribute.fieldProperties) {
        type = valueOfAttribute.fieldProperties.map((property) => {
            return fieldProperties.find((obj) => obj.fieldPropertyId === property);
        });
    }
    return type;
}
