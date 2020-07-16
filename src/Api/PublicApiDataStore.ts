import {
  RestClient,
  RestApi,
  RequestBody,
  PathParam,
  QueryParams,
  FormDataBody,
  FileUploadBody,
  ApiResponse,
} from 'restapi-typescript-decorators';

import { HttpBinResponse, HttpBinRequest } from './types';

@RestClient({
  baseUrl: 'https://httpbin.org',
})
export class PublicApiDataStore {
  @RestApi('/post', {
    method: 'POST',
  })
  doPostWithBody(@RequestBody _body: HttpBinRequest): ApiResponse<HttpBinResponse> {}

  @RestApi('/get')
  doGetWithQueryParams(@QueryParams _queryParams: HttpBinRequest): ApiResponse<HttpBinResponse> {}

  @RestApi('/anything/{messageId}')
  doGetWithPathParams(
    @PathParam('messageId') _targetMessageId: string,
    @QueryParams _queryParams: HttpBinRequest,
  ): ApiResponse<HttpBinResponse> {}

  @RestApi('/anything', {
    method: 'POST',
  })
  doPostWithFormData(
    @FormDataBody('unitPrice') _unitPrice: number,
    @FormDataBody('quantity') _qty: number,
  ): ApiResponse<HttpBinResponse> {}

  @RestApi('/post', {
    method: 'POST',
  })
  doPostUploadFile(
    @FormDataBody('fileToUpload') _file: HttpBinRequest,
  ): ApiResponse<HttpBinResponse> {}

  @RestApi('/post', {
    method: 'POST',
    headers: {
      Accept: 'multipart/form-data',
    },
  })
  doPostUploadFileAsStream(@FileUploadBody _file: any): ApiResponse<HttpBinResponse> {}
}
