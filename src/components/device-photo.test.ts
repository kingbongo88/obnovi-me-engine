import { describe, expect, it } from "vitest";
import { devicePhotoFor } from "./device-photo";
import iphone16eBlack from "../assets/models/iphone-16e-black.jpg.asset.json";
import iphone16eWhite from "../assets/models/iphone-16e-white.jpg.asset.json";
import iphone17ProDeepBlue from "../assets/models/iphone-17-pro-deep-blue.jpg";
import iphone17ProSilver from "../assets/models/iphone-17-pro-silver.jpg";

describe("model-specific phone photos", () => {
  it("uses the single-camera 16e photo instead of the dual-camera 16", () => {
    expect(devicePhotoFor("iPhone 16e", "Black")).toBe(iphone16eBlack.url);
    expect(devicePhotoFor("iPhone 16e")).not.toBe(devicePhotoFor("iPhone 16"));
  });
  it("switches the actual 16e photo when the finish changes", () => {
    expect(devicePhotoFor("iPhone 16e", "White")).toBe(iphone16eWhite.url);
    expect(devicePhotoFor("iPhone 16e", "Black")).not.toBe(devicePhotoFor("iPhone 16e", "White"));
  });
  it("uses the full-width camera plateau photo for 17 Pro and Pro Max", () => {
    expect(devicePhotoFor("iPhone 17 Pro")).toBe(iphone17ProDeepBlue);
    expect(devicePhotoFor("iPhone 17 Pro Max")).toBe(iphone17ProDeepBlue);
    expect(devicePhotoFor("iPhone 17 Pro")).not.toBe(devicePhotoFor("iPhone 16 Pro"));
  });
  it("switches the 17 Pro photo to its selected real finish", () => {
    expect(devicePhotoFor("iPhone 17 Pro", "Silver")).toBe(iphone17ProSilver);
    expect(devicePhotoFor("iPhone 17 Pro", "Silver")).not.toBe(devicePhotoFor("iPhone 17 Pro", "Deep Blue"));
  });
});