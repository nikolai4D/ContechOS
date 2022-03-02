import getDefType from './getDefType.js';
import Actions from '../../store/Actions.js';

export function getDefTypeFromSessionStorage(defType) {
    const defTypeTitle = getDefType(defType.defId, defType.defTypeId)
        .defTypeTitle;
    Actions.GETALL(defTypeTitle);
    return JSON.parse(sessionStorage.getItem(`${defTypeTitle}`));
}