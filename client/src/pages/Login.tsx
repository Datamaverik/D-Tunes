import { useForm, FieldError } from "react-hook-form";
import TextInputField from "../components/form/TextInputField";
import styles from "../components/styles/form.module.css";
import * as UserApi from "../network/api";
// import { AxiosError } from "axios";
import useToast from "../CustomHooks/Toast.hook";
import useLoading from "../CustomHooks/Loading.hook";

interface LoginPageProps {
  onSuccessfulLogin: (username: string) => void;
}

const Login = ({ onSuccessfulLogin }: LoginPageProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserApi.loginCredentials>();

  const {setLoading} = useLoading();
  const { showToast } = useToast();

  async function onSubmit(credentials: UserApi.loginCredentials) {
    setLoading(true);
    try {
      const user = await UserApi.login(credentials);
      if (user) {
        onSuccessfulLogin(credentials.username);
        showToast("Logged in successfully", "success");
        console.log(user);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (er: any) {
      console.log(er);
      showToast(er.message, "warning");
    }
    finally{
      setLoading(false);
    }
  }

  function handleDAuth() {
    const authUrl = new URL("https://auth.delta.nitt.edu/authorize");
    authUrl.searchParams.append("client_id", "HKEkBu-lR.2ZoPhz");
    authUrl.searchParams.append(
      "redirect_uri",
      "http://localhost:5000/api/users/authenticate"
    );
    authUrl.searchParams.append("grant_type", "authorization_code");
    authUrl.searchParams.append("state", "qm2a@g5!ap&5#b");
    authUrl.searchParams.append("scope", "email openid profile user");
    authUrl.searchParams.append("nonce", "qm2a@g5!ap&5#b");
    authUrl.searchParams.append("response_type", "code");

    console.log(authUrl);

    window.location.href = authUrl.toString();
  }

  return (
    <div className={styles.loginCont}>
      <div className={styles.banner}></div>
      <div className={styles.formCont}>
        <button onClick={handleDAuth}>Log in with DAuth</button>
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
