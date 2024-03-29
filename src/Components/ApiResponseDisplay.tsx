import React, { useState } from 'react';
import { ApiResponse } from 'restapi-typescript-decorators';
import { PublicApiDataStore } from '../Api/PublicApiDataStore';

import { HttpBinResponse } from '../Api/types';

const myPublicApiDataStoreInstance = new PublicApiDataStore();

// method name, api method reference, params
const testApis = [
  [
    'Do Get with QueryParams',
    (): ApiResponse<HttpBinResponse> =>
      myPublicApiDataStoreInstance.doGetWithQueryParams({ d: 4, e: 5, f: 6 }),
  ],
  [
    'Do Get with PathParams and RequestBody',
    (): ApiResponse<HttpBinResponse> =>
      myPublicApiDataStoreInstance.doGetWithPathParams('some_secure_message_id_987', {
        x: 9,
        y: 8,
        z: 7,
      }),
  ],
  [
    'Do Post with RequestBody',
    (): ApiResponse<HttpBinResponse> =>
      myPublicApiDataStoreInstance.doPostWithBody({ a: 1, b: 2, c: 3 }),
  ],
  [
    'Do Post with FormData',
    (): ApiResponse<HttpBinResponse> =>
      myPublicApiDataStoreInstance.doPostWithFormData(
        100, // qty
        456, // unit price
      ),
  ],
];

function ApiTesterResponse({ metadata }) {
  if (!metadata) {
    return null;
  }
  const { apiName, apiResponse, resp, loading } = metadata;
  const { ...otherApiResponse } = apiResponse || {};

  return (
    <div>
      <div>
        <h2 className='mb1'>
          API Response for <u>{apiName}</u>
        </h2>
      </div>
      {loading ? (
        <div>
          <h3>Loading...</h3>
        </div>
      ) : (
        <div>
          <div>
            <div className='mb1'>
              <strong className='mr2'>URL:</strong>
              {apiResponse.method} {apiResponse.url}
            </div>
            <div className='mb1'>
              <strong className='mr2'>Status:</strong>
              {apiResponse.status}
            </div>
          </div>
          <div>
            <h4>Response MetaData:</h4>
          </div>
          <textarea
            className='ApiResponseDisplay__ResponseCode mb2'
            defaultValue={JSON.stringify(otherApiResponse, null, 2)}></textarea>
          <div>
            <h4>Response Content:</h4>
          </div>
          <textarea
            className='ApiResponseDisplay__ResponseCode'
            defaultValue={JSON.stringify(resp, null, 2)}></textarea>
        </div>
      )}
    </div>
  );
}

function DoUploadFileAsFormDataApiTesterButton(props) {
  const { setCurrentApiMetaData } = props;
  const _onUploadFile = (e) => {
    e.preventDefault(); // stop form from submitting

    const newApiMetaData = { apiName: 'doPostUploadFile', loading: true };
    setCurrentApiMetaData(newApiMetaData);

    // this example only upload one file
    const fileUploadDom = document.querySelector('#fileToUploadAsFormData') as HTMLInputElement;
    if (fileUploadDom && fileUploadDom.files) {
      const fileToBeUploaded = fileUploadDom.files[0];

      // do callback and set the value
      const apiResponse = myPublicApiDataStoreInstance.doPostUploadFile(fileToBeUploaded);
      apiResponse &&
        apiResponse.result.then(
          (resp) => {
            setCurrentApiMetaData({
              ...newApiMetaData,
              apiResponse,
              resp,
              loading: false,
            });

            console.assert(
              resp.data?.length > 0,
              `${newApiMetaData.apiName} API should upload some data`,
            );
          },
          () => {
            setCurrentApiMetaData({
              ...newApiMetaData,
              apiResponse,
              loading: false,
            });

            console.assert(false, `${newApiMetaData.apiName} API failed to fetch`);
          },
        );
    }
  };

  return (
    <form onSubmit={_onUploadFile}>
      <input type='file' id='fileToUploadAsFormData' required />
      <button className='btnApi' type='submit'>
        Upload As FormData
      </button>
    </form>
  );
}

function DoUploadFileAsStreamApiTesterButton(props) {
  const { setCurrentApiMetaData } = props;
  const _onUploadFile = (e) => {
    e.preventDefault(); // stop form from submitting

    const newApiMetaData = { apiName: 'doPostUploadFileAsStream', loading: true };
    setCurrentApiMetaData(newApiMetaData);

    // this example only upload one file
    const fileUploadDom = document.querySelector('#fileToUploadAsStream') as HTMLInputElement;
    if (fileUploadDom && fileUploadDom.files) {
      const fileToBeUploaded = fileUploadDom.files[0];

      // do callback and set the value
      const apiResponse = myPublicApiDataStoreInstance.doPostUploadFileAsStream(fileToBeUploaded);
      apiResponse &&
        apiResponse.result.then(
          (resp) => {
            setCurrentApiMetaData({
              ...newApiMetaData,
              apiResponse,
              resp,
              loading: false,
            });

            console.assert(
              !!resp.url && !!resp.headers,
              `${newApiMetaData.apiName} API should upload some data`,
            );
          },
          () => {
            setCurrentApiMetaData({
              ...newApiMetaData,
              apiResponse,
              loading: false,
            });

            console.assert(false, `${newApiMetaData.apiName} API failed to fetch`);
          },
        );
    }
  };

  return (
    <form onSubmit={_onUploadFile}>
      <input type='file' id='fileToUploadAsStream' required />
      <button className='btnApi' type='submit'>
        Upload As Stream
      </button>
    </form>
  );
}

export function ApiTesterSection() {
  const [currentApiMetaData, setCurrentApiMetaData] = useState<any>(null);

  const _onCallAPI = (apiName, callBack) => (e) => {
    // this simply makes the currently clicked button disabled
    // to make it easier to see and disabled double click...
    document.querySelectorAll('.btnApi').forEach((b) => {
      const btn = b as HTMLInputElement;
      btn.disabled = e.target === btn;
    });

    const newApiMetaData = { apiName, loading: true };
    setCurrentApiMetaData(newApiMetaData);

    // do callback and set the value
    const apiResponse = callBack();
    if (apiResponse) {
      apiResponse.result.then(
        (resp) => {
          setCurrentApiMetaData({
            ...newApiMetaData,
            apiResponse,
            resp,
            loading: false,
          });
        },
        () => {
          setCurrentApiMetaData({
            ...newApiMetaData,
            apiResponse,
            loading: false,
          });

          console.assert(false, `${newApiMetaData.apiName} API failed to fetch`);
        },
      );
    }
  };

  return (
    <div className='ApiResponseDisplay'>
      <div className='ApiResponseDisplay__Actions'>
        {testApis.map(([apiName, apiCallback], idx) => (
          <div className='mb1' key={`${apiName}-${idx}`}>
            <button className='btnApi' type='button' onClick={_onCallAPI(apiName, apiCallback)}>
              {apiName}
            </button>
          </div>
        ))}
        <div className='mb1'>
          <DoUploadFileAsFormDataApiTesterButton setCurrentApiMetaData={setCurrentApiMetaData} />
        </div>
        <div className='mb1'>
          <DoUploadFileAsStreamApiTesterButton setCurrentApiMetaData={setCurrentApiMetaData} />
        </div>
      </div>
      <div className='ApiResponseDisplay__Response'>
        <ApiTesterResponse metadata={currentApiMetaData} />
      </div>
    </div>
  );
}
