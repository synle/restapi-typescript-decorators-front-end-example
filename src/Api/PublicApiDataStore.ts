import {
  RestClient,
  RestApi,
  RequestBody,
  PathParam,
  QueryParams,
  FormDataBody,
  FileToUpload,
  ApiResponse,
} from 'restapi-typescript-decorators';

import { HttpBinGetResponse, HttpBinPostResponse } from './HttpBinTypes';

@RestClient({
  baseUrl: 'https://httpbin.org',
})
export class PublicApiDataStore {
  @RestApi('/post', {
    method: 'POST',
  })
  doPostWithBody(@RequestBody _body): ApiResponse<HttpBinPostResponse> {}

  @RestApi('/get')
  doGetWithQueryParams(@QueryParams _queryParams): ApiResponse<HttpBinGetResponse> {}

  @RestApi('/anything/{messageId}')
  doGetWithPathParams(
    @PathParam('messageId') _targetMessageId: string,
    @QueryParams _queryParams,
  ): ApiResponse<HttpBinGetResponse> {}

  @RestApi('/anything', {
    method: 'POST',
  })
  doPostWithFormData(
    @FormDataBody('unitPrice') _unitPrice: number,
    @FormDataBody('quantity') _qty: number,
  ): ApiResponse<HttpBinPostResponse> {}

  @RestApi('/post', {
    method: 'POST',
  })
  doPostUploadFile(@FormDataBody('fileToUpload') _file): ApiResponse<HttpBinPostResponse> {}


  @RestApi('/post', {
    method: 'POST',
  })
  doPostUploadFileAsStream(@FileToUpload _file): ApiResponse<HttpBinPostResponse> { }
}
