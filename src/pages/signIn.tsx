import AuthLayout from "@/components/auth/authlayout";
import AuthTabs from "@/components/auth/authTabs";
import SignInForm from "@/components/auth/signInForm";
import SignUpForm from "@/components/auth/signUpForm";

export default function SignIn() {
  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <img
            src="/Clip path group.svg"
            alt="Foody"
            className="w-8 h-8 md:w-10.5 md:h-10.5"
          />
          <span className="text-display-xs font-extrabold text-neutral-950 md:text-display-md">
            Foody
          </span>
        </div>

        <div>
          <h1 className="text-display-xs font-extrabold text-neutral-950 md:text-display-sm">
            Welcome Back
          </h1>
          <p className="text-sm text-neutral-950 font-medium md:text-md">
            Good to see you again! Let’s eat
          </p>
        </div>

        <AuthTabs
          signInContent={<SignInForm />}
          signUpContent={<SignUpForm />}
        />
      </div>
    </AuthLayout>
  );
}
