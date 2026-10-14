import { describe, it, expect } from "vitest";
import {
  extractGoogleDriveFileId,
  isDirectImageUrl,
  getPreviewInfo,
} from "./thumbnailHelper";

describe("thumbnailHelper", () => {
  describe("extractGoogleDriveFileId", () => {
    it("extracts file ID from standard /file/d/ format", () => {
      const url = "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0-xyz/view?usp=sharing";
      expect(extractGoogleDriveFileId(url)).toBe("1A2B3C4D5E6F7G8H9I0-xyz");
    });

    it("extracts file ID from open?id= format", () => {
      const url = "https://drive.google.com/open?id=1234567890ABCDEF";
      expect(extractGoogleDriveFileId(url)).toBe("1234567890ABCDEF");
    });

    it("extracts file ID from uc?id= format", () => {
      const url = "https://drive.google.com/uc?id=MyDriveFile_123&export=download";
      expect(extractGoogleDriveFileId(url)).toBe("MyDriveFile_123");
    });

    it("extracts file ID from Google Docs/Sheets/Slides URLs", () => {
      const docsUrl = "https://docs.google.com/document/d/1XyZ_Doc123/edit";
      expect(extractGoogleDriveFileId(docsUrl)).toBe("1XyZ_Doc123");

      const sheetUrl = "https://docs.google.com/spreadsheets/d/1Sheet_456/edit#gid=0";
      expect(extractGoogleDriveFileId(sheetUrl)).toBe("1Sheet_456");
    });

    it("returns null for non-Drive URLs", () => {
      expect(extractGoogleDriveFileId("https://example.com/file/d/123")).toBe(null);
      expect(extractGoogleDriveFileId("https://bps.go.id")).toBe(null);
      expect(extractGoogleDriveFileId("")).toBe(null);
    });
  });

  describe("isDirectImageUrl", () => {
    it("detects image file extensions correctly", () => {
      expect(isDirectImageUrl("https://domain.com/photo.jpg")).toBe(true);
      expect(isDirectImageUrl("https://domain.com/image.png?v=123")).toBe(true);
      expect(isDirectImageUrl("https://domain.com/visual.WEBP")).toBe(true);
      expect(isDirectImageUrl("https://domain.com/document.pdf")).toBe(false);
    });

    it("detects Unsplash CDN URLs", () => {
      expect(isDirectImageUrl("https://images.unsplash.com/photo-1542744094-3a31f272c490")).toBe(true);
    });
  });

  describe("getPreviewInfo", () => {
    it("returns gdrive preview info with thumbnail and peek URLs", () => {
      const driveUrl = "https://drive.google.com/file/d/sampleId123/view";
      const info = getPreviewInfo(driveUrl);
      expect(info.hasPreview).toBe(true);
      expect(info.isGoogleDrive).toBe(true);
      expect(info.sourceType).toBe("gdrive");
      expect(info.thumbnailUrl).toBe("https://lh3.googleusercontent.com/d/sampleId123=w600");
      expect(info.peekUrl).toBe("https://lh3.googleusercontent.com/d/sampleId123=w1600");
      expect(info.fallbackThumbnailUrl).toBe("https://drive.google.com/thumbnail?id=sampleId123&sz=w600");
    });

    it("returns direct image preview info", () => {
      const imgUrl = "https://mycdn.bps.go.id/chart.png";
      const info = getPreviewInfo(imgUrl);
      expect(info.hasPreview).toBe(true);
      expect(info.isDirectImage).toBe(true);
      expect(info.sourceType).toBe("direct_image");
      expect(info.thumbnailUrl).toBe(imgUrl);
    });

    it("returns hasPreview: false for standard website URLs", () => {
      const siteUrl = "https://solokselatankab.bps.go.id";
      const info = getPreviewInfo(siteUrl);
      expect(info.hasPreview).toBe(false);
      expect(info.thumbnailUrl).toBe(null);
    });
  });
});
