import { FieldError, useForm } from "react-hook-form";
import TextInputField from "../components/form/TextInputField";
import styles from "../components/styles/form.module.css";
import * as UserApi from "../network/api";
import { AxiosError } from "axios";

interface SignUpPageProps {
  onSuccessfulSignUp: (username: string) => void;
}

const SignUp = ({ onSuccessfulSignUp }: SignUpPageProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserApi.signUpCredentials>();

  async function onSubmit(credentials: UserApi.signUpCredentials) {
    try {
      const newUser = await UserApi.signUp(credentials);
      if (newUser) {
        onSuccessfulSignUp(credentials.username);
        console.log(newUser);
      }
    } catch (er) {
      console.error(er);
      if (er instanceof AxiosError) alert(er.response?.data.message);
    }
  }

  return (
    <div className={styles.formCont}>
      <form
        action="post"
        className={styles.formGroup}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInputField
          name="username"
          label="Username"
          type="text"
          placeholder="Username"
          register={register}
          registerOptions={{
            required: "required",
            minLength: 3,
            maxLength: 255,
          }}
          error={errors.username as FieldError}
        />
        <TextInputField
          name="email"
          label="Email"
          type="email"
          placeholder="Email"
          register={register}
          registerOptions={{
            required: "required",
            minLength: 3,
            maxLength: 255,
          }}
          error={errors.email as FieldError}
        />
        <TextInputField
          name="password"
          label="Password"
          type="password"
          placeholder="Password"
          register={register}
          registerOptions={{
            required: "required",
            minLength: 3,
            maxLength: 255,
          }}
          error={errors.password as FieldError}
        />
        <button type="submit" className={styles.signUpBtn}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
