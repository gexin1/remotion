import {
	GetObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	_Object,
} from '@aws-sdk/client-s3';
import {ReadStream} from 'fs';
import {Readable} from 'stream';
import {AwsRegion} from '../../pricing/aws-regions';
import {getS3Client} from '../../shared/aws-clients';

export const lambdaLs = async ({
	bucketName,
	prefix,
	region,
}: {
	bucketName: string;
	prefix: string;
	region: AwsRegion;
}): Promise<_Object[]> => {
	const list = await getS3Client(region).send(
		new ListObjectsV2Command({
			Bucket: bucketName,
			Prefix: prefix,
		})
	);
	return list.Contents ?? [];
};

export const lambdaWriteFile = async ({
	bucketName,
	key,
	body,
	region,
}: {
	bucketName: string;
	key: string;
	body: ReadStream | string;
	region: AwsRegion;
}): Promise<void> => {
	await getS3Client(region).send(
		new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			Body: body,
			// TODO: should not be default
			ACL: 'public-read',
		})
	);
};

export const lambdaReadFile = async ({
	bucketName,
	key,
	region,
}: {
	bucketName: string;
	key: string;
	region: AwsRegion;
}): Promise<Readable | Buffer> => {
	const {Body} = await getS3Client(region).send(
		new GetObjectCommand({
			Bucket: bucketName,
			Key: key,
		})
	);
	return Body as Readable;
};
