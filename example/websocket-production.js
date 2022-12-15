const init = {
    headers: {
        "content-type": "text/html;charset=UTF-8",
    },
}

const GET_TYPE = { type: "text" };

const route = {
    '/': 'http://xxx/www-screen',
    '/screen': 'http://xxx/www-screen',
    '/player': 'http://xxx/www-player',
    '/admin': 'http://xxx/www-admin',
    '/api': 'http://xxx/api'
}


async function gatherResponse(response) {
    const headers = response.headers
    const contentType = headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
        return JSON.stringify(await response.json())
    } else if (contentType.includes("application/text")) {
        return await response.text();
    } else if (contentType.includes("text/html;charset=UTF-8")) {
        return await response.text();
    } else {
        return await response.blob();
    }
}
function getRouteReg(route) {
    const routeTemplate = '(^{{route}}$)|(^{{route}}\/)';  // 替换的时候会带上'/',故不在模版增加
    return Object.keys(route).reduce((accumulator, key) => {
        if (!accumulator[key]) {
            if(key === '/') {
                accumulator[key] =  new RegExp('^\/$');
            } else {
                accumulator[key] = new RegExp(routeTemplate.replace(new RegExp('{{route}}', 'g'), key));
            }
       
        }
        return accumulator;
    }, {});
}

const routeReg = getRouteReg(route);

// const routeReg = {
//     '/screen': new RegExp('(^\/screen$)|(^\/screen\/)'),
//     '/player': new RegExp('(^\/player$)|(^\/player\/)'),
//     '/admin': new RegExp('(^\/admin$)|(^\/admin\/)'),
//     '/api': new RegExp('(^\/api$)|(^\/api\/)'),
//     '/': new RegExp('^\/$')
// }
const regValues = Object.keys(routeReg).map(key => ({ route: key, reg: routeReg[key] }));

async function handleRequest(request) {

    try {

        const requestHeaders = request.headers || init.headers;
        const body = request.body;
        const method = request.method;
        const url = new URL(request.url);
        const { pathname, search } = url;
        // const cacheResponse = await cache.get(request);
        // if (cacheResponse) {
        //     return cacheResponse;
        // }

        let finalurl = 'https://www.aliyun.com/';
        let refferPath = '';

        const referrer = request.headers.get('referer');
        if (referrer) {
            const refferUrl = new URL(referrer);
            refferPath = refferUrl.pathname;
        }

        regValues.forEach((value) => {
            if (pathname.match(value.reg) || refferPath.match(value.reg)) {
                finalurl = route[value.route] + pathname.replace(value.reg, '/') + search
            }
        });

        const fetch_response = await fetch(finalurl, { headers: requestHeaders, method, body });
        const results = await gatherResponse(fetch_response)
        const finalResponse = new Response(results, fetch_response.headers);
        finalResponse.headers.append('Cache-Control', 'max-age=31536000')
        // await cache.put(request, finalResponse);
        return finalResponse;
    } catch (e) {
        return new Response(JSON.stringify({ message: e.message }), {
            headers: {
                "content-type": "application/json;charset=UTF-8"
            }
        })
    }

}

addEventListener("fetch", event => {

    return event.respondWith(handleRequest(event.request))
})