const fullPath = window.location.pathname;
const splitPath = fullPath.split('/');
if (splitPath[splitPath.length - 1] == 'index.html') {
	splitPath.pop();
}
export const endPath = splitPath.length > 2 ? splitPath.join('/') : '';