import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/services/queries/useAuth";

const schema = z
  .object({
    name: z.string().refine((v) => v.trim().length > 0, {
      message: "Name can't be empty",
    }),
    email: z
      .string()
      .min(1, "Email is required")
      .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: 'Email must contain "@" sign and domain name',
      }),
    phone: z.string().min(1, "Number Phone is required"),
    password: z.string().min(8, "Password must contain at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password didn't match",
  });

type FormValues = z.infer<typeof schema>;

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const name = watch("name");
  const email = watch("email");
  const phone = watch("phone");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = (values: FormValues) => {
    registerMutation.mutate(
      {
        name: values.name.trim(),
        email: values.email,
        phone: values.phone,
        password: values.password,
      },
      {
        onSuccess: () => {
          navigate("/sign-in");
        },
      },
    );
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-1">
        <div className="relative">
          {name && (
            <label className="absolute top-1 left-2.5 bg-transparent px-1 text-[10px] text-neutral-500 md:text-xs md:top-0">
              Name
            </label>
          )}
          <Input
            placeholder="Name"
            className="relative h-12 pt-2 text-sm font-semibold md:text-md md:h-14"
            {...register("name")}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-primary-100">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <div className="relative">
          {email && (
            <label className="absolute top-1 left-2.5 bg-transparent px-1 text-[10px] text-neutral-500 md:text-xs md:top-0">
              Email
            </label>
          )}
          <Input
            placeholder="Email"
            className="relative h-12 pt-2 text-sm font-semibold md:text-md md:h-14"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-primary-100">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <div className="relative">
          {phone && (
            <label className="absolute top-1 left-2.5 bg-transparent px-1 text-[10px] text-neutral-500 md:text-xs md:top-0">
              Number Phone
            </label>
          )}
          <Input
            placeholder="Number Phone"
            className="relative h-12 pt-2 text-sm font-semibold md:text-md md:h-14"
            {...register("phone")}
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-primary-100">{errors.phone.message}</p>
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
            className="relative h-12 pt-2 text-sm font-semibold md:text-md md:h-14"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-4 cursor-pointer"
          >
            <img src={showPassword ? "/eye-light.svg" : "/eye-off-light.svg"} />
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-primary-100">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <div className="relative">
          {confirmPassword && (
            <label className="absolute top-1 left-2.5 bg-transparent px-1 text-[10px] text-neutral-500 md:text-xs md:top-0">
              Confirm Password
            </label>
          )}
          <Input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="relative h-12 pt-2 text-sm font-semibold md:text-md md:h-14"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-4 cursor-pointer"
          >
            <img src={showConfirm ? "/eye-light.svg" : "/eye-off-light.svg"} />
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-primary-100">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      {registerMutation.isError && (
        <p className="text-sm text-primary-100">
          {(() => {
            const err = registerMutation.error as any;
            const status = err?.response?.status;

            if (status === 409) {
              return "Email / Number Phone has already used";
            }

            return "Registration failed. Please try again.";
          })()}
        </p>
      )}
      <Button
        type="submit"
        className="w-full h-12 rounded-full bg-primary-100 text-md font-bold cursor-pointer"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
