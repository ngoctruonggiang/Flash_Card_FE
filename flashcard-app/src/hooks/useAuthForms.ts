import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const useLoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const success = await login(formData.email, formData.password);

    if (success) {
      router.push("/dashboard");
    } else {
      setError("❌ Email hoặc mật khẩu không đúng!");
      setIsLoading(false);
    }
  };

  return {
    showPassword,
    setShowPassword,
    isLoading,
    error,
    formData,
    setFormData,
    handleSubmit,
  };
};

export const useRegisterForm = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("❌ Mật khẩu không khớp!");
      return;
    }

    setIsLoading(true);

    const success = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (success) {
      router.push("/dashboard");
    } else {
      alert("❌ Tài khoản đã tồn tại hay cái gì đấy!");
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  return {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    error,
    formData,
    setFormData,
    handleSubmit,
    passwordStrength,
  };
};
