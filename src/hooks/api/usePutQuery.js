import React from 'react';
import {useMutation, useQueryClient} from 'react-query'
import {request} from "../../services/api";
import {toast} from "react-toastify";

const putRequest = (url, attributes,config) => request.put(url, attributes,config);

const usePutQuery = ({hideSuccessToast = false, listKeyId = null}) => {


        const queryClient = useQueryClient();

        const {mutate, isLoading, isError, error, isFetching} = useMutation(
            ({
                 url, attributes,config
             }) => putRequest(url, attributes,config),
            {
                onSuccess: (data) => {
                    if (!hideSuccessToast) {
                        toast.success(data?.data?.message || 'SUCCESS')
                    }

                    if (listKeyId) {
                        queryClient.invalidateQueries(listKeyId)
                    }
                },
                onError: (data) => {
                    toast.error(data?.response?.data?.message || 'ERROR')
                }
            }
        );

        return {
            mutate,
            isLoading,
            isError,
            error,
            isFetching,
        }
    }
;

export default usePutQuery;
