import { PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { clsx } from 'clsx';
import Image from 'next/image';
import React, { DragEventHandler, forwardRef, useState } from 'react';
import { Control, Controller, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { TbCircleCheckFilled, TbCircleXFilled, TbCloudUpload, TbFile, TbLoader } from 'react-icons/tb';

interface FileInputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  accept?: string;
  label: string;
  error?: string;
}

export function FileInputField<T extends FieldValues>({ control, name, ...props }: FileInputFieldProps<T>) {
  return (
    <Controller
      render={({ field: { ref, ...field } }) => <FileInput ref={ref} {...field} {...props} />}
      name={name}
      control={control}
    />
  );
}

interface FileInputProps extends ControllerRenderProps {
  label?: string;
  error?: string;
  accept?: string;
  className?: string;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ label, error, accept, className, value, name, onChange }, ref) => {
    const [blob, setBlob] = useState<PutBlobResult | null>(null);
    const [uploadError, setUploadError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFileSelect(e.target.files[0]);
      }
    };

    const dropHandler: DragEventHandler<HTMLDivElement> = (ev) => {
      ev.preventDefault();

      const items = [...ev.dataTransfer.items].map((item) => item.getAsFile());
      const files = [...ev.dataTransfer.files, ...items];
      if (files[0] !== null) {
        handleFileSelect(files[0]);
      }
    };

    const handleFileSelect = (file: File) => {
      setBlob(null);
      setUploadError(undefined);
      if (!checkSize(file)) setUploadError('A fájl mérete nem lehet nagyobb, mint 10MB.');
      setLoading(true);
      upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/files/upload',
      })
        .then((res) => {
          setBlob(res);
          setUploadError(undefined);
          onChange(res.url);
        })
        .catch(() => {
          setUploadError('Hiba történt a fájl feltöltése közben.');
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const dragOverHandler: DragEventHandler<HTMLDivElement> = (ev) => {
      ev.preventDefault();
    };

    return (
      <div className={className}>
        {label && <label>{label}</label>}
        <label className='m-0' htmlFor={name}>
          <div
            onDrop={dropHandler}
            onDragOver={dragOverHandler}
            className='relative h-80 w-full border border-dashed border-slate-200 text-primary-600 dark:text-primary-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center'
          >
            <div className='flex gap-2 max-h-full'>
              {value ? (
                <FilePreview url={String(value)} />
              ) : (
                <>
                  <TbCloudUpload size={20} />
                  Húzd ide a fájlt vagy kattints
                </>
              )}
            </div>
            <div
              className={clsx('absolute right-1 bottom-1', {
                'text-green-500': Boolean(blob),
                'text-red-500': uploadError,
              })}
            >
              {Boolean(blob) && <TbCircleCheckFilled className='bg-white rounded-full p-0.5' size={30} />}
              {uploadError && <TbCircleXFilled className='bg-white rounded-full p-0.5' size={30} />}
              {loading && <TbLoader size={30} className='animate-spin bg-white rounded-full p-0.5' />}
            </div>
          </div>
        </label>
        <input ref={ref} id={name} type='file' onChange={onInputChange} className='hidden' accept={accept} />
        {error && <div className='text-red-500'>{error}</div>}
        {uploadError && <div className='text-red-500'>{uploadError}</div>}
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';

function FilePreview({ url }: { url: string }) {
  const isImage = url.match(/(jpg|jpeg|png|gif)$/i)?.length ?? 0 > 0;
  return isImage ? (
    <Image
      src={url}
      layout='fixed'
      width={1500}
      height={1000}
      alt='preview'
      className='rounded-md object-contain object-center'
    />
  ) : (
    <TbFile size={40} />
  );
}

function checkSize(file: File) {
  const size = file.size / 1024 / 1024;
  return size < 5;
}
