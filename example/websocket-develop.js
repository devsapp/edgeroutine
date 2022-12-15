const init = {
    headers: {
        "content-type": "text/html;charset=UTF-8",
    },
}

const SCREEN_ROUTE_REG = /^\/(www-screen)\/?/g;

const PLAYER_ROUTE_REG = /^\/(www-player)\/?/g;

const ADMIN_ROUTE_REG = /^\/(www-admin)\/?/g;

const API_ROUTER_REG = /^\/(api)/g;

const GET_TYPE = { type: "text" };
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


async function handleRequest(request) {
    try {
        const requestHeaders = request.headers || init;


        const staticUrl = '';
        const apiUrl = '';

        const body = request.body;
        const method = request.method;
        const url = new URL(request.url);
        const { pathname, search } = url;


        let finalurl = (staticUrl + pathname + search);
        if (pathname.match(SCREEN_ROUTE_REG)) {
            finalurl = staticUrl + pathname + search;
        } else if (pathname.match(PLAYER_ROUTE_REG)) {
            finalurl = staticUrl + pathname + search;
        } else if (pathname.match(ADMIN_ROUTE_REG)) {
            finalurl = staticUrl + pathname + search;
        } else if (pathname.match(API_ROUTER_REG)) {
            finalurl = apiUrl + pathname + search;
        } else {
            finalurl = staticUrl + '/www-screen' + pathname + search;
        }

        // if(!pathname.match(API_ROUTER_REG)) {
        //     const cacheResponse = await cache.get(finalurl);
        //     if(cacheResponse) {
        //         return cacheResponse;
        //     }
        // }


        const fetch_response = await fetch(finalurl, { headers: requestHeaders, method, body });

        const results = await gatherResponse(fetch_response)
        const finalResponse = new Response(results, fetch_response.headers);
        finalResponse.headers.append('Cache-Control', 'max-age=31536000')
        // try {
        //     await cache.put(finalurl,finalResponse);
        // } catch(e) {}
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