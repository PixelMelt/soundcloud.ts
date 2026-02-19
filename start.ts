import SoundCloud from "./soundcloud"

require("dotenv").config()
const soundcloud = new SoundCloud();
(async () => {
    const title = await soundcloud.util.getTitle("https://soundcloud.com/5tereomanjpn/aire-tea-timestereoman-remix")
    console.log(title)
})()