export function fetchHomeData() {
    console.log("Fetching home data...");
    return Promise.resolve({
        status: "success",
        data: "Home data loaded"
    });
}
