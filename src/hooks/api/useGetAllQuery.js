import React from 'react';
import {useQuery} from 'react-query'
import {request} from "../../services/api";
import toast from "react-hot-toast";

const useGetAllQuery = ({
                          key = "get-all",
                          url = "/",
                          params = {},
                          hideErrorMsg = false,
                          enabled = true,
                          headers = {}
                        }) => {

  const {isLoading, isError, data, error, isFetching} = useQuery([key, params], () => request.get(url, {
    params,
    headers
  }), {
    onSuccess: () => {
    },
    onError: (data) => {
      if (!hideErrorMsg) {
        toast.error(data?.response?.data?.error?.message || `ERROR!!! ${url} api not working`)
      }
    },
    enabled
  });

  return {
    isLoading,
    isError,
    data,
    error,
    isFetching
  }
};

export default useGetAllQuery;
