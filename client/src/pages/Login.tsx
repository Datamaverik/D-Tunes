import { useForm, FieldError } from "react-hook-form";
import TextInputField from "../components/form/TextInputField";
import styles from "../components/styles/form.module.css";
import * as UserApi from "../network/api";
import { AxiosError } from "axios";

interface LoginPageProps {
  onSuccessfulLogin: (username: string) => void;
}

const Login = ({ onSuccessfulLogin }: LoginPageProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserApi.loginCredentials>();

  async function onSubmit(credentials: UserApi.loginCredentials) {
    try {
      const user = await UserApi.login(credentials);
      if (user) {
        onSuccessfulLogin(credentials.username);
        console.log(user);
      }
    } catch (er) {
      console.error(er);
      if (er instanceof AxiosError) alert(er.response?.data.message);
    }
  }

  return (
    <div className={styles.loginCont}>
      <div className={styles.banner}>
      </div>
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
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
