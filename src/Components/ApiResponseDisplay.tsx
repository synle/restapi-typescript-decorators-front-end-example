import React, { useState } from 'react';
import { ApiResponse } from 'restapi-typescript-decorators';
import { PublicApiDataStore } from '../Api/PublicApiDataStore';

const myPublicApiDataStoreInstance = new PublicApiDataStore();

// method name, api method reference, params
const testApis = [
  [
    'Do Get with QueryParams',
    (): ApiResponse => myPublicApiDataStoreInstance.doGetWithQueryParams({ d: 4, e: 5, f: 6 }),
  ],
  [
    'Do Get with PathParams and RequestBody',
    (): ApiResponse =>
      myPublicApiDataStoreInstance.doGetWithPathParams('some_secure_message_id_987', {
        x: 9,
        y: 8,
        z: 7,
      }),
  ],
  [
    'Do Post with RequestBody',
    (): ApiResponse => myPublicApiDataStoreInstance.doPostWithBody({ a: 1, b: 2, c: 3 }),
  ],
  [
    'Do Post with FormData',
    (): ApiResponse =>
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
  const { result, ...otherApiResponse } = apiResponse || {};

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

    const fileToBeUploaded = document.querySelector('#fileToUploadAsFormData').files[0]; // this example only upload one file

    // do callback and set the value
    const apiResponse = myPublicApiDataStoreInstance.doPostUploadFile(fileToBeUploaded);
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
      },
    );
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

    const newApiMetaData = { apiName: 'doPostUploadFile', loading: true };
    setCurrentApiMetaData(newApiMetaData);

    const fileToBeUploaded = document.querySelector('#fileToUploadAsStream').files[0]; // this example only upload one file

    // do callback and set the value
    const apiResponse = myPublicApiDataStoreInstance.doPostUploadFileAsStream(fileToBeUploaded);
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
      },
    );
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
  const [currentApiMetaData, setCurrentApiMetaData] = useState(null);

  const _onCallAPI = (apiName, callBack) => (e) => {
    // this simply makes the currently clicked button disabled
    // to make it easier to see and disabled double click...
    document.querySelectorAll('.btnApi').forEach((b) => (b.disabled = e.target === b));

    const newApiMetaData = { apiName, loading: true };
    setCurrentApiMetaData(newApiMetaData);

    // do callback and set the value
    const apiResponse = callBack();
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
      },
    );
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
