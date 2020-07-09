export const LocalStorageMethods = {
    store(key, value) {
        console.log('local storage store...');
        try {
            if (typeof(Storage) !== 'undefined') {
                console.log('storage set: ' + key);
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return error;
        }
    },
    retrieve(key) {
        try {
            if (typeof(Storage) !== 'undefined') {
                if (localStorage.getItem(key)) {
                    console.log('storage get: ' + key);
                    return JSON.parse(localStorage.getItem(key));
                } else {
                    return null;
                }
            } else {
                return false;
            }
        } catch (error) {
            return error;
        }
    },
    remove(key) {
        try {
            if (typeof(Storage) !== 'undefined') {
                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key);
                    return true;
                } else {
                    return null;
                }
            } else {
                return false;
            }
        } catch (error) {
            return error;
        }
    },
    clear() {
        try {
            if (typeof(Storage) !== 'undefined') {
                localStorage.clear();
            } else {
                return false;
            }
        } catch (error) {
            return error;
        }
    }
};

export const UrlMethods = {
    decodeWithoutParams(url) {
        try {
            let cleanUrl = decodeURIComponent(url).split('?')[0] || '';
            if (cleanUrl === '/') {
                cleanUrl = '';
            }
            return cleanUrl;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
};
