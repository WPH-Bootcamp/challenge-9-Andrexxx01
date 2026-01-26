import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLoginMutation } from "@/services/queries/useAuth";
import { useAppDispatch } from "@/features/hooks";
import { setAuth } from "@/features/auth/authSlice";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Email must contain "@" sign and domain name',
    }),
  password: z.string().min(8, "Password must contain at least 8 characters"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const email = watch("email");
  const password = watch("password");

  const onSubmit = (values: FormValues) => {
    loginMutation.mutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: (res) => {
          console.log("LOGIN RESPONSE:", res);
          dispatch(
            setAuth({
              token: res.data.token,
              user: res.data.user,
            }),
          );

          navigate("/");
        },
      },
    );
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email */}
      <div className="space-y-1">
        <div className="relative ">
          {email && (
            <label className="absolute top-1 left-2.5 bg-transparent px-1 text-[10px] text-neutral-500 md:text-xs md:top-0">
              Email
            </label>
          )}
          <Input
            type="email"
            placeholder="Email"
            className="relative h-12 pt-2 text-sm font-semibold md:text-md md:h-14 md:pt-2"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-primary-100">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <div className="relative">
          {password && (
            <label className="absolute top-1 left-2.5 bg-transparent px-1 text-[10px] text-neutral-500 md:text-xs md:top-0">
              Password
            </label>
          )}
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="relative h-12 pt-2 text-sm font-semibold md:text-md md:h-14 md:pt-2"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-4 cursor-pointer"
          >
            {showPassword ? (
              <img src="/eye-light.svg" />
            ) : (
              <img src="/eye-off-light.svg" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-primary-100">{errors.password.message}</p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          className="size-5 rounded-sm border-neutral-300 data-[state=checked]:bg-primary-100 data-[state=checked]:border-primary-100 data-[state=checked]:text-white cursor-pointer"
          {...register("remember")}
        />
        <label
          htmlFor="remember"
          className="text-sm font-medium md:text-md text-neutral-950"
        >
          Remember Me
        </label>
      </div>

      {/* API Error */}
      {loginMutation.isError && (
        <p className="text-sm text-destructive">
          Login failed. Please check your email or password.
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="w-full h-12 rounded-full bg-primary-100 text-md font-bold cursor-pointer"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
