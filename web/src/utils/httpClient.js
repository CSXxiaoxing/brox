
import request from 'superagent';

const LOCAL_SERVER = WANJI_ALL_URL; 

function getUrl(path) {
    if (path.startsWith('http')) {
        return path;
    }
    return `${LOCAL_SERVER}${path}`;
}

const HttpClient = {
    get: (path, query) => new Promise((resolve, reject) => {
        var req = request
            .get(getUrl(path))
            .query(query)
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.body);
                }
            });
    }),

    post: (path, formdata, query, vm) => new Promise((resolve, reject) => {
        if(vm){ vm['loading'] = true }
        if (formdata) {
            formdata['sign'] = localStorage.brToken || '' ;
            formdata['uid'] = localStorage.brUid || '' ;
        }
        request
            .post(getUrl(path))
            .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
            .query(query)
            .send(formdata)
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    // console.log(res)
                    // resolve(res.text);
                    resolve(JSON.parse(res.text));
                }
                if(vm)(vm['loading'] = false)
            });
    })
};

export default HttpClient;