import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAccount } from "wagmi";
import { Icon } from "@iconify/react";
import { createWebhook } from "../../../api/webhooks";
import { CreateWebhookRequest } from "../../../types/webhooks";

const FormField = ({ name, label, type = "text", as, children, icon }: any) => (
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
        as={as}
        type={type}
        className={`
          block w-full rounded-lg
          ${icon ? "pl-10" : "pl-4"} pr-4 py-3
          bg-gray-50 border border-gray-300
          text-gray-900 text-sm
          focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200
          ${as === "select" ? "appearance-none" : ""}
        `}
      >
        {children}
      </Field>
      {as === "select" && (
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <Icon
            icon="heroicons:chevron-down"
            className="h-5 w-5 text-gray-400"
          />
        </div>
      )}
    </div>
    <ErrorMessage
      name={name}
      component="div"
      className="mt-1 text-sm text-red-600 dark:text-red-500"
    />
  </div>
);

function NotificationsComponent() {
  const { address } = useAccount();

  const { mutate: createWebhookMutation, isPending } = useMutation({
    mutationFn: createWebhook,
    onSuccess: () => {
      // Show success toast
    },
  });

  const initialValues: Partial<CreateWebhookRequest> = {
    notification: {
      webhookUrl: "",
    },
    eventType: "SUCCESSFUL_TRANSACTION",
    description: "",
    condition: {
      addresses: [address || ""],
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-2 text-gray-600">
              Set up webhooks to monitor your portfolio activity
            </p>
          </div>
          <Icon icon="heroicons:bell" className="h-8 w-8 text-blue-500" />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon icon="heroicons:plus" className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Webhook
            </h2>
          </div>

          <Formik
            initialValues={initialValues}
            onSubmit={(values) => createWebhookMutation(values)}
          >
            <Form className="space-y-6">
              <FormField
                name="notification.webhookUrl"
                label="Webhook URL"
                type="url"
                icon="heroicons:link"
              />

              <FormField
                name="eventType"
                label="Event Type"
                as="select"
                icon="heroicons:bell-alert"
              >
                <option value="SUCCESSFUL_TRANSACTION">
                  Successful Transaction
                </option>
                <option value="FAILED_TRANSACTION">Failed Transaction</option>
                <option value="TOKEN_TRANSFER">Token Transfer</option>
                <option value="ADDRESS_ACTIVITY">Address Activity</option>
                <option value="MINED_TRANSACTION">Mined Transaction</option>
                <option value="BELOW_THRESHOLD_BALANCE">
                  Below Threshold Balance
                </option>
                <option value="BLOCK_PERIOD">Block Period</option>
                <option value="BLOCK_LIST_CALLER">Block List Caller</option>
                <option value="ALLOW_LIST_CALLER">Allow List Caller</option>
                <option value="LOG">Log</option>
                <option value="EVENT">Event</option>
              </FormField>

              <FormField
                name="description"
                label="Description (Optional)"
                icon="heroicons:document-text"
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

export const Route = createFileRoute("/dashboard/notifications/create")({
  component: NotificationsComponent,
});
