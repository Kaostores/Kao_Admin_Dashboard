import React, { useState, useEffect } from "react";
import { VscChromeClose, VscFileSymlinkFile } from "react-icons/vsc";

type Iprops = {
  togleBtn: () => void;
  onFileChange: (files: {
    cacDocument?: File;
    kycDocument?: File;
    businessDocument?: File;
    utilityBill?: File;
  }) => void;
  onSubmit: () => void;
  storeDetails: {
    cacDocument?: string;
    kycDocument?: string;
    businessDocument?: string;
    utilityBill?: string;
  };
};

const Upload: React.FC<Iprops> = ({ togleBtn, onFileChange, onSubmit, storeDetails }) => {
  const [cacDocument, setCacDocument] = useState<File | null>(null);
  const [kycDocument, setKycDocument] = useState<File | null>(null);
  const [businessDocument, setBusinessDocument] = useState<File | null>(null);
  const [utilityBill, setUtilityBill] = useState<File | null>(null);

  useEffect(() => {
    if (storeDetails) {
      if (storeDetails.cacDocument) setCacDocument(storeDetails.cacDocument as unknown as File);
      if (storeDetails.kycDocument) setKycDocument(storeDetails.kycDocument as unknown as File);
      if (storeDetails.businessDocument) setBusinessDocument(storeDetails.businessDocument as unknown as File);
      if (storeDetails.utilityBill) setUtilityBill(storeDetails.utilityBill as unknown as File);
    }
  }, [storeDetails]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    onFileChange({ [docType]: file });

    if (docType === "cacDocument") {
      setCacDocument(file || null);
    } else if (docType === "kycDocument") {
      setKycDocument(file || null);
    } else if (docType === "businessDocument") {
      setBusinessDocument(file || null);
    } else if (docType === "utilityBill") {
      setUtilityBill(file || null);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-[#ffffffd9]">
      <div className="bg-white w-[40%] rounded-[10px] overflow-y-scroll h-[70%] flex flex-col p-[20px] border border-[#0000ff]">
        <div className="flex justify-between items-center mb-[20px]">
          <h2>Upload Documents</h2>
          <button onClick={togleBtn} className="text-red-500">
            <VscChromeClose />
          </button>
        </div>

        <div className="mb-[10px]">
          <label htmlFor="cacDocument" className="block mb-[5px]">CAC Document</label>
          <input
            type="file"
            id="cacDocument"
            className="border border-gray-300 p-[5px] w-full"
            onChange={(e) => handleFileChange(e, "cacDocument")}
          />
          {cacDocument && <p>Current file: {storeDetails.cacDocument}</p>}
        </div>

        <div className="mb-[10px]">
          <label htmlFor="kycDocument" className="block mb-[5px]">KYC Document</label>
          <input
            type="file"
            id="kycDocument"
            className="border border-gray-300 p-[5px] w-full"
            onChange={(e) => handleFileChange(e, "kycDocument")}
          />
          {kycDocument && <p>Current file: {storeDetails.kycDocument}</p>}
        </div>

        <div className="mb-[10px]">
          <label htmlFor="businessDocument" className="block mb-[5px]">Business Document</label>
          <input
            type="file"
            id="businessDocument"
            className="border border-gray-300 p-[5px] w-full"
            onChange={(e) => handleFileChange(e, "businessDocument")}
          />
          {businessDocument && <p>Current file: {storeDetails.businessDocument}</p>}
        </div>

        <div className="mb-[10px]">
          <label htmlFor="utilityBill" className="block mb-[5px]">Utility Bill</label>
          <input
            type="file"
            id="utilityBill"
            className="border border-gray-300 p-[5px] w-full"
            onChange={(e) => handleFileChange(e, "utilityBill")}
          />
          {utilityBill && <p>Current file: {storeDetails.utilityBill}</p>}
        </div>

        <button
          type="button"
          className="bg-blue-500 text-white px-[25px] py-[5px] rounded-[5px] flex justify-center items-center"
          onClick={onSubmit}
        >
          <VscFileSymlinkFile className="mr-[5px]" /> Upload
        </button>
      </div>
    </div>
  );
};

export default Upload;
