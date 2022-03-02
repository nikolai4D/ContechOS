import { State } from '../../store/State.js';

import dropDown from '../DropDownField.js';

export default function (getPropsForParentId, parentConfigObject) {

    let dropDownHtmlString = ''
    console.log(getPropsForParentId, parentConfigObject)
    parentConfigObject.typeDataPropKeys.forEach(propKey => {
        let filtered = getPropsForParentId.filter(node => node.parentId === propKey)
        console.log(filtered)
        let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })
        if (filtered.length > 0) {
            State.propKeys.push({ "title": propKeyObj.title, "id": propKey })
            dropDownHtmlString += dropDown(propKeyObj.title, filtered, null, propKey.id);
        }
    });
    return dropDownHtmlString;
}  