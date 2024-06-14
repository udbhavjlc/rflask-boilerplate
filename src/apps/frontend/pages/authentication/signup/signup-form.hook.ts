import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';

import constant from '../../../constants';
import { useAuthContext } from '../../../contexts';
import { AsyncError } from '../../../types';

interface SignupFormProps {
  onError: (err: AsyncError) => void;
  onSuccess: () => void;
}
const useSignupForm = ({ onError, onSuccess }: SignupFormProps) => {
  const { isSignupLoading, signupError, signup } = useAuthContext();
  const { customer_type } = useParams();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      customer_type: customer_type,
      password: '',
      retypePassword: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(
          constant.FIRST_NAME_MIN_LENGTH,
          constant.FIRST_NAME_VALIDATION_ERROR,
        )
        .required(constant.FIRST_NAME_VALIDATION_ERROR),
      lastName: Yup.string()
        .min(constant.LAST_NAME_MIN_LENGTH, constant.LAST_NAME_VALIDATION_ERROR)
        .required(constant.LAST_NAME_VALIDATION_ERROR),
      username: Yup.string()
        .email(constant.EMAIL_VALIDATION_ERROR)
        .required(constant.EMAIL_VALIDATION_ERROR),
      password: Yup.string()
        .min(constant.PASSWORD_MIN_LENGTH, constant.PASSWORD_VALIDATION_ERROR)
        .required(constant.PASSWORD_VALIDATION_ERROR),
      retypePassword: Yup.string()
        .oneOf([Yup.ref('password')], constant.PASSWORD_MATCH_VALIDATION_ERROR)
        .required(constant.PASSWORD_MATCH_VALIDATION_ERROR),
    }),
    onSubmit: (values) => {
      signup(
        values.firstName,
        values.lastName,
        values.username,
        values.customer_type,
        values.password,
      )
        .then(() => {
          onSuccess();
        })
        .catch((err) => {
          onError(err as AsyncError);
        });
    },
  });

  return {
    formik,
    isSignupLoading,
    signupError,
  };
};

export default useSignupForm;
