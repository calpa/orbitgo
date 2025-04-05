import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAccount } from "wagmi";
import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { createWebhook } from "../../../api/webhooks";
import { CreateWebhookRequest } from "../../../types/webhooks";
import { PROTOCOL_NETWORKS } from "../../../constants/networks";
import { findChainId, getChainIcon } from "../../../utils/chains";
import Swal from "sweetalert2";
import { useNavigate } from "@tanstack/react-router";

const FormField = ({ name, label, type = "text", icon }: any) => (
  <div className="mb-6 relative">
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-700 mb-2"
    >
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon icon={icon} className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <Field
        id={name}
        name={name}
        type={type}
        className={`
          block w-full rounded-lg
          ${icon ? "pl-10" : "pl-4"} pr-4 py-3
          bg-gray-50 border border-gray-300
          text-gray-900 text-sm
          focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200
        `}
      />
    </div>
    <ErrorMessage
      name={name}
      component="div"
      className="mt-1 text-sm text-red-600 dark:text-red-500"
    />
  </div>
);

export const Route = createFileRoute("/dashboard/notifications/create")({
  component: CreateWebhookComponent,
});

function CreateWebhookComponent() {
  const { address } = useAccount();
  const navigate = useNavigate();
  const { mutate: createWebhookMutation, isPending } = useMutation({
    mutationFn: createWebhook,
    onSuccess: async () => {
      // Show success toast and redirect
      const res = await Swal.fire({
        icon: "success",
        title: "Webhook created successfully",
        showConfirmButton: true,
        timer: 10000,
      });

      if (res.isConfirmed || res.isDismissed) {
        navigate({ to: "/dashboard/notifications" });
      }
    },
  });

  const initialValues: CreateWebhookRequest = {
    addresses: [address || ""],
    webhookUrl: "",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/dashboard/notifications"
            className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50"
          >
            <Icon icon="heroicons:arrow-left" className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Webhook</h1>
            <p className="text-gray-600">
              Create all chains notifications (powered by NODIT)
            </p>
            <p className="text-gray-600">
              Protocols:{" "}
              {Object.keys(PROTOCOL_NETWORKS).map((protocol) => (
                <div key={protocol} className="inline-flex items-center gap-2">
                  {getChainIcon(findChainId(protocol) || 0) ? (
                    <img
                      src={getChainIcon(findChainId(protocol) || 0)}
                      alt={protocol}
                      className="w-5 h-5"
                    />
                  ) : (
                    <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                      {protocol[0].toUpperCase()}
                    </span>
                  )}
                  {protocol[0].toUpperCase() + protocol.slice(1)},{" "}
                </div>
              ))}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => createWebhookMutation(values)}
          >
            <Form className="space-y-6">
              <FormField
                name="webhookUrl"
                label="Webhook URL"
                type="url"
                icon="heroicons:link"
              />

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className={`
                    w-full flex items-center justify-center gap-2
                    px-6 py-3 rounded-lg
                    text-white font-semibold
                    transition-all duration-200
                    ${
                      isPending
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                    }
                  `}
                >
                  {isPending ? (
                    <>
                      <Icon
                        icon="heroicons:arrow-path"
                        className="h-5 w-5 animate-spin"
                      />
                      Creating Webhook...
                    </>
                  ) : (
                    <>
                      <Icon icon="heroicons:plus-circle" className="h-5 w-5" />
                      Create Webhook
                    </>
                  )}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}
