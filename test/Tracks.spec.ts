import { assert } from "chai";
import "mocha";
import { soundcloud } from "./login";

describe("Tracks", function () {
  // test download divetotheheart/q9lrztc7lq4h
  //   it("should get a track", async function () {
  //     const response = await soundcloud.util.downloadTrack(
  //       "https://soundcloud.com/divetotheheart/q9lrztc7lq4h"
  //     );

  //     assert(Object.prototype.hasOwnProperty.call(response, "description"));
  //   });

  it("should get a track", async function () {
    const response = await soundcloud.tracks.get(
      "https://soundcloud.com/nocopyrightsounds/jonth-soundclash-ncs-release"
    );
    assert(Object.prototype.hasOwnProperty.call(response, "description"));
  });

  it("should search tracks", async function () {
    const response = await soundcloud.tracks.search({ q: "virtual riot" });
    assert(
      Object.prototype.hasOwnProperty.call(
        response.collection[0],
        "description"
      )
    );
  });
});
