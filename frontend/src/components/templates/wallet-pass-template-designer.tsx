"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

// Validation schema
const fieldSchema = z.object({
  key: z.string().min(1, "Field key is required"),
  label: z.string().min(1, "Field label is required"),
  value: z.string().min(1, "Field value is required"),
  type: z.enum(["text", "number", "date", "currency"]),
  text_alignment: z.enum(["left", "center", "right"]),
});

const templateSchema = z.object({
  name: z.string().min(3, "Template name must be at least 3 characters"),
  description: z.string().optional(),
  pass_type: z.enum(["generic", "coupon", "eventTicket", "boardingPass", "storeCard"]),
  background_color: z.string().regex(/^#([0-9A-F]{6}|[0-9A-F]{3})$/i, "Must be a valid hex color").optional(),
  foreground_color: z.string().regex(/^#([0-9A-F]{6}|[0-9A-F]{3})$/i, "Must be a valid hex color").optional(),
  label_color: z.string().regex(/^#([0-9A-F]{6}|[0-9A-F]{3})$/i, "Must be a valid hex color").optional(),
  header_fields: z.array(fieldSchema).optional(),
  primary_fields: z.array(fieldSchema).min(1, "At least one primary field is required"),
  secondary_fields: z.array(fieldSchema).optional(),
  auxiliary_fields: z.array(fieldSchema).optional(),
  back_fields: z.array(fieldSchema).optional(),
  expiration_type: z.enum(["none", "fixed", "relative"]).optional(),
  expiration_value: z.string().optional(),
  nfc_enabled: z.boolean().optional(),
  nfc_message: z.string().optional(),
});

type TemplateForm = z.infer<typeof templateSchema>;

interface PassTemplateDesignerProps {
  templateId?: string;
  initialData?: any;
}

export default function PassTemplateDesigner({ templateId, initialData }: PassTemplateDesignerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const defaultValues: TemplateForm = {
    name: "",
    description: "",
    pass_type: "generic",
    background_color: "#FFFFFF",
    foreground_color: "#000000",
    label_color: "#7D7D7D",
    header_fields: [],
    primary_fields: [{ key: "primary1", label: "Primary Field", value: "Value", type: "text", text_alignment: "left" }],
    secondary_fields: [],
    auxiliary_fields: [],
    back_fields: [],
    expiration_type: "none",
    expiration_value: "",
    nfc_enabled: false,
    nfc_message: "",
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
  } = useForm<TemplateForm>({
    resolver: zodResolver(templateSchema),
    defaultValues: initialData || defaultValues,
  });

  // Use useFieldArray to handle dynamic fields
  const primaryFields = useFieldArray({
    control,
    name: "primary_fields",
  });

  const secondaryFields = useFieldArray({
    control,
    name: "secondary_fields",
  });

  const auxiliaryFields = useFieldArray({
    control,
    name: "auxiliary_fields",
  });

  const backFields = useFieldArray({
    control,
    name: "back_fields",
  });

  const headerFields = useFieldArray({
    control,
    name: "header_fields",
  });

  // Watch for form changes to render the preview
  const formValues = watch();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: TemplateForm) => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (templateId) {
        // Update existing template
        await axios.put(`${apiUrl}/templates/${templateId}`, data);
        toast.success("Template updated successfully!");
      } else {
        // Create new template
        const response = await axios.post(`${apiUrl}/templates`, data);
        toast.success("Template created successfully!");
        router.push(`/dashboard/templates/${response.data.id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to save template");
      console.error("Template save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {templateId ? "Edit Pass Template" : "Create Pass Template"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  type="button"
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "general"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("general")}
                >
                  General
                </button>
                <button
                  type="button"
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "fields"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("fields")}
                >
                  Fields
                </button>
                <button
                  type="button"
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "appearance"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("appearance")}
                >
                  Appearance
                </button>
                <button
                  type="button"
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "advanced"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("advanced")}
                >
                  Advanced
                </button>
              </nav>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Template Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name")}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      {...register("description")}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="pass_type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Pass Type *
                    </label>
                    <select
                      id="pass_type"
                      {...register("pass_type")}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    >
                      <option value="generic">Generic</option>
                      <option value="coupon">Coupon</option>
                      <option value="eventTicket">Event Ticket</option>
                      <option value="boardingPass">Boarding Pass</option>
                      <option value="storeCard">Store Card</option>
                    </select>
                    {errors.pass_type && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.pass_type.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="expiration_type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Expiration Type
                    </label>
                    <select
                      id="expiration_type"
                      {...register("expiration_type")}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    >
                      <option value="none">No Expiration</option>
                      <option value="fixed">Fixed Date</option>
                      <option value="relative">Relative (Days)</option>
                    </select>
                  </div>

                  {formValues.expiration_type !== "none" && (
                    <div>
                      <label
                        htmlFor="expiration_value"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {formValues.expiration_type === "fixed"
                          ? "Expiration Date"
                          : "Days from Creation"}
                      </label>
                      <input
                        id="expiration_value"
                        type={formValues.expiration_type === "fixed" ? "date" : "number"}
                        {...register("expiration_value")}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === "fields" && (
                <div className="space-y-8">
                  {/* Header Fields */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Header Fields</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          headerFields.append({
                            key: `header${headerFields.fields.length + 1}`,
                            label: `Header ${headerFields.fields.length + 1}`,
                            value: "Value",
                            type: "text",
                            text_alignment: "left",
                          })
                        }
                      >
                        Add Header Field
                      </Button>
                    </div>
                    
                    {headerFields.fields.length === 0 ? (
                      <p className="text-sm text-gray-500">No header fields added yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {headerFields.fields.map((field, index) => (
                          <div key={field.id} className="border border-gray-200 rounded-md p-4">
                            <div className="flex justify-between mb-2">
                              <h4 className="font-medium">Header Field {index + 1}</h4>
                              <button
                                type="button"
                                onClick={() => headerFields.remove(index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Key
                                </label>
                                <input
                                  type="text"
                                  {...register(`header_fields.${index}.key`)}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Label
                                </label>
                                <input
                                  type="text"
                                  {...register(`header_fields.${index}.label`)}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Value
                                </label>
                                <input
                                  type="text"
                                  {...register(`header_fields.${index}.value`)}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Type
                                </label>
                                <select
                                  {...register(`header_fields.${index}.type`)}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                >
                                  <option value="text">Text</option>
                                  <option value="number">Number</option>
                                  <option value="date">Date</option>
                                  <option value="currency">Currency</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Primary Fields */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Primary Fields *</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          primaryFields.append({
                            key: `primary${primaryFields.fields.length + 1}`,
                            label: `Primary ${primaryFields.fields.length + 1}`,
                            value: "Value",
                            type: "text",
                            text_alignment: "left",
                          })
                        }
                      >
                        Add Primary Field
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {primaryFields.fields.map((field, index) => (
                        <div key={field.id} className="border border-gray-200 rounded-md p-4">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">Primary Field {index + 1}</h4>
                            {primaryFields.fields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => primaryFields.remove(index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Key
                              </label>
                              <input
                                type="text"
                                {...register(`primary_fields.${index}.key`)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Label
                              </label>
                              <input
                                type="text"
                                {...register(`primary_fields.${index}.label`)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Value
                              </label>
                              <input
                                type="text"
                                {...register(`primary_fields.${index}.value`)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Type
                              </label>
                              <select
                                {...register(`primary_fields.${index}.type`)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                              >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="currency">Currency</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.primary_fields && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.primary_fields.message}
                      </p>
                    )}
                  </div>

                  {/* Secondary Fields */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Secondary Fields</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          secondaryFields.append({
                            key: `secondary${secondaryFields.fields.length + 1}`,
                            label: `Secondary ${secondaryFields.fields.length + 1}`,
                            value: "Value",
                            type: "text",
                            text_alignment: "left",
                          })
                        }
                      >
                        Add Secondary Field
                      </Button>
                    </div>
                    
                    {secondaryFields.fields.length === 0 ? (
                      <p className="text-sm text-gray-500">No secondary fields added yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {secondaryFields.fields.map((field, index) => (
                          <div key={field.id} className="border border-gray-200 rounded-md p-4">
                            <div className="flex justify-between mb-2">
                              <h4 className="font-medium">Secondary Field {index + 1}</h4>
                              <button
                                type="button"
                                onClick={() => secondaryFields.remove(index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Key
                                </label>
                                <input
                                  type="text"
                                  {...register(`secondary_fields.${index}.key`)}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Label
                                </label>
                                <input
                                  type="text"
                                  {...register(`secondary_fields.${index}.label`)}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Value
                                </label>
                                <input
                                  type="text"
                                  {...register(`secondary_fields.${index}.value`)}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Type
                                </label>
                                <select
                                  {...register(`secondary_fields.${index}.type`)}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                >
                                  <option value="text">Text</option>
                                  <option value="number">Number</option>
                                  <option value="date">Date</option>
                                  <option value="currency">Currency</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                
                  {/* Add similar sections for auxiliary_fields and back_fields if needed */}
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="background_color"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Background Color
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="color"
                        id="background_color"
                        {...register("background_color")}
                        className="h-8 w-8 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        {...register("background_color")}
                        className="ml-2 block w-40 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    {errors.background_color && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.background_color.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="foreground_color"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Foreground Color
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="color"
                        id="foreground_color"
                        {...register("foreground_color")}
                        className="h-8 w-8 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        {...register("foreground_color")}
                        className="ml-2 block w-40 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    {errors.foreground_color && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.foreground_color.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="label_color"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Label Color
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="color"
                        id="label_color"
                        {...register("label_color")}
                        className="h-8 w-8 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        {...register("label_color")}
                        className="ml-2 block w-40 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    {errors.label_color && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.label_color.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Image
                    </label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                      >
                        Upload Logo
                      </Button>
                      <span className="ml-2 text-sm text-gray-500">
                        Recommended size: 160x50px
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon Image
                    </label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                      >
                        Upload Icon
                      </Button>
                      <span className="ml-2 text-sm text-gray-500">
                        Recommended size: 58x58px
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "advanced" && (
                <div className="space-y-6">
                  <div className="flex items-center">
                    <input
                      id="nfc_enabled"
                      type="checkbox"
                      {...register("nfc_enabled")}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor="nfc_enabled"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Enable NFC
                    </label>
                  </div>

                  {formValues.nfc_enabled && (
                    <div>
                      <label
                        htmlFor="nfc_message"
                        className="block text-sm font-medium text-gray-700"
                      >
                        NFC Message
                      </label>
                      <textarea
                        id="nfc_message"
                        rows={3}
                        {...register("nfc_message")}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  )}

                  {/* Add more advanced options as needed */}
                </div>
              )}

              <div className="mt-8 pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="mr-3"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !isDirty}
                  >
                    {isLoading
                      ? "Saving..."
                      : templateId
                      ? "Update Template"
                      : "Create Template"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Template Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border border-gray-300 rounded-lg overflow-hidden"
              style={{
                backgroundColor: formValues.background_color || "#FFFFFF",
                color: formValues.foreground_color || "#000000",
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              {/* Pass Header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                  Logo
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wide" style={{ color: formValues.label_color || "#7D7D7D" }}>
                    Pass Type
                  </div>
                  <div className="font-medium">
                    {formValues.pass_type === "generic" ? "Generic" :
                     formValues.pass_type === "coupon" ? "Coupon" :
                     formValues.pass_type === "eventTicket" ? "Event Ticket" :
                     formValues.pass_type === "boardingPass" ? "Boarding Pass" :
                     "Store Card"}
                  </div>
                </div>
              </div>

              {/* Header Fields */}
              {formValues.header_fields && formValues.header_fields.length > 0 && (
                <div className="p-4 border-b border-gray-200">
                  <div className="flex flex-wrap -mx-2">
                    {formValues.header_fields.map((field, index) => (
                      <div key={index} className="px-2 w-1/2 mb-2">
                        <div className="text-xs uppercase tracking-wide" style={{ color: formValues.label_color || "#7D7D7D" }}>
                          {field.label}
                        </div>
                        <div className="font-medium">{field.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Fields */}
              <div className="p-4 border-b border-gray-200">
                {formValues.primary_fields && formValues.primary_fields.map((field, index) => (
                  <div key={index} className="mb-2 last:mb-0">
                    <div className="text-xs uppercase tracking-wide" style={{ color: formValues.label_color || "#7D7D7D" }}>
                      {field.label}
                    </div>
                    <div className="font-bold text-lg">{field.value}</div>
                  </div>
                ))}
              </div>

              {/* Secondary Fields */}
              {formValues.secondary_fields && formValues.secondary_fields.length > 0 && (
                <div className="p-4 border-b border-gray-200">
                  <div className="flex flex-wrap -mx-2">
                    {formValues.secondary_fields.map((field, index) => (
                      <div key={index} className="px-2 w-1/2 mb-2">
                        <div className="text-xs uppercase tracking-wide" style={{ color: formValues.label_color || "#7D7D7D" }}>
                          {field.label}
                        </div>
                        <div className="font-medium">{field.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Auxiliary Fields */}
              {formValues.auxiliary_fields && formValues.auxiliary_fields.length > 0 && (
                <div className="p-4">
                  <div className="flex flex-wrap -mx-2">
                    {formValues.auxiliary_fields.map((field, index) => (
                      <div key={index} className="px-2 w-1/2 mb-2">
                        <div className="text-xs uppercase tracking-wide" style={{ color: formValues.label_color || "#7D7D7D" }}>
                          {field.label}
                        </div>
                        <div className="font-medium">{field.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pass Footer */}
              <div className="p-4 bg-gray-50 text-center text-xs text-gray-500">
                {formValues.expiration_type !== "none" && (
                  <div>
                    Expires: {formValues.expiration_type === "fixed" 
                      ? formValues.expiration_value || "Not set" 
                      : `${formValues.expiration_value || "0"} days after creation`}
                  </div>
                )}
                {formValues.nfc_enabled && (
                  <div className="mt-1">NFC Enabled</div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              This is a simplified preview. The actual pass appearance may vary slightly on different devices and wallet apps.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}