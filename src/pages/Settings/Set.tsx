'use client';

import React, { useState } from "react";
import { UpdateHeroBanner, UpdateMiddleAdvert } from '../../utils/ApiCalls';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const [heroBanner, setHeroBanner] = useState<File | null>(null);
  const [middleAdvert, setMiddleAdvert] = useState<File | null>(null);
  const [previewHeroBanner, setPreviewHeroBanner] = useState<string | null>(null);
  const [previewMiddleAdvert, setPreviewMiddleAdvert] = useState<string | null>(null);
  const [show, setShow] = useState(true);
  const [show2, setShow2] = useState(false);
  const [isLoadingHero, setIsLoadingHero] = useState(false);
  const [isLoadingAdvert, setIsLoadingAdvert] = useState(false);

  const Togglebanner = () => {
    setShow(true);
    setShow2(false);
  };

  const ToggleAdvert = () => {
    setShow2(true);
    setShow(false);
  };

  const { getRootProps: getRootPropsHero, getInputProps: getInputPropsHero } =
    useDropzone({
      accept: { "image/*": [] },
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        setHeroBanner(file);
        setPreviewHeroBanner(URL.createObjectURL(file));
      },
      multiple: false,
    });

  const { getRootProps: getRootPropsAdvert, getInputProps: getInputPropsAdvert } =
    useDropzone({
      accept: { "image/*": [] },
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        setMiddleAdvert(file);
        setPreviewMiddleAdvert(URL.createObjectURL(file));
      },
      multiple: false,
    });

  const handleHeroBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroBanner) {
      toast.error("Please select a banner image.");
      return;
    }

    setIsLoadingHero(true);
    const formData = new FormData();
    formData.append("media", heroBanner);

    try {
      const response = await UpdateHeroBanner(formData);
      if (response.status === 201) {
        toast.success("Hero banner updated successfully!");
        setHeroBanner(null);
        setPreviewHeroBanner(null);
      }
    } catch {
      toast.error("Failed to update hero banner.");
    } finally {
      setIsLoadingHero(false);
    }
  };

  const handleMiddleAdvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!middleAdvert) {
      toast.error("Please select an advert image.");
      return;
    }

    setIsLoadingAdvert(true);
    const formData = new FormData();
    formData.append("media", middleAdvert);

    try {
      const response = await UpdateMiddleAdvert(formData);
      if (response.status === 201) {
        toast.success("Middle advert updated successfully!");
        setMiddleAdvert(null);
        setPreviewMiddleAdvert(null);
      }
    } catch {
      toast.error("Failed to update middle advert.");
    } finally {
      setIsLoadingAdvert(false);
    }
  };

  return (
    <div className="w-full bg-white flex justify-center pb-2 sm:pb-2">
      <div className="w-full flex flex-col">

        {/* Tabs */}
        <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-6 py-3 border-b border-[#a8a8a8]">
          <h1
            onClick={Togglebanner}
            className={`text-sm sm:text-base font-semibold text-center sm:text-left cursor-pointer text-[#0333AE]
            ${show ? "underline underline-offset-4" : ""}`}
          >
            Update hero banner
          </h1>

          <h1
            onClick={ToggleAdvert}
            className={`text-sm sm:text-base font-semibold text-center sm:text-left cursor-pointer text-[#0333AE]
            ${show2 ? "underline underline-offset-4" : ""}`}
          >
            Update home middle advert
          </h1>
        </div>

        {/* Hero Banner */}
        {show && (
          <div className="mt-4 sm:mt-6 w-full flex flex-col gap-4">
            <div
              {...getRootPropsHero()}
              className="w-full h-36 sm:h-48 border-2 border-dashed bg-blue-50 p-4 sm:p-6 rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-blue-100 transition"
            >
              <input {...getInputPropsHero()} />
              <p className="text-xs sm:text-base">
                Drag and drop an image here, or click to select a file
              </p>
            </div>

            {previewHeroBanner && (
              <div className="w-full">
                <h3 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                  Preview:
                </h3>
                <img
                  src={previewHeroBanner}
                  alt="Hero Banner Preview"
                  className="w-full sm:w-[500px] h-auto sm:h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            <div className="w-full flex justify-end">
              <Button
                disabled={isLoadingHero}
                className="bg-[#0333AE] hover:bg-[#0333AE] w-full sm:w-auto"
                onClick={handleHeroBannerSubmit}
              >
                {isLoadingHero ? "Updating..." : "Update hero banner"}
              </Button>
            </div>
          </div>
        )}

        {/* Middle Advert */}
        {show2 && (
          <div className="mt-4 sm:mt-6 w-full flex flex-col gap-4">
            <div
              {...getRootPropsAdvert()}
              className="w-full h-36 sm:h-48 border-2 border-dashed bg-blue-50 p-4 sm:p-6 rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-blue-100 transition"
            >
              <input {...getInputPropsAdvert()} />
              <p className="text-xs sm:text-base text-[#0333AE]">
                Drag and drop an image here, or click to select a file
              </p>
            </div>

            {previewMiddleAdvert && (
              <div className="w-full">
                <h3 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                  Preview:
                </h3>
                <img
                  src={previewMiddleAdvert}
                  alt="Middle Advert Preview"
                  className="w-full sm:w-[500px] h-auto sm:h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            <div className="w-full flex justify-end">
              <Button
                disabled={isLoadingAdvert}
                className="bg-[#0333AE] hover:bg-[#0333AE] w-full sm:w-auto"
                onClick={handleMiddleAdvertSubmit}
              >
                {isLoadingAdvert ? "Updating..." : "Update home banner"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
