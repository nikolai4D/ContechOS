import getDefType from './getDefType.js';
import Actions from '../../store/Actions.js';

export function getDefTypeFromSessionStorage(defType) {
    const defTypeTitle = getDefType(defType.defId, defType.defTypeId)
        .defTypeTitle;
    let getNodesRels = ''
    if (defTypeTitle === 'propKey') {
        getNodesRels = 'props'
    }
    else if (defTypeTitle === 'configObj') {
        getNodesRels = 'configs'
    }
    let allNodesOfInView = JSON.parse(sessionStorage.getItem(`${getNodesRels}`))[0].nodes;
    return allNodesOfInView.filter(obj => obj.defTypeTitle === defTypeTitle);
}