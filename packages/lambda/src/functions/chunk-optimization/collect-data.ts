import {AwsRegion} from '../../pricing/aws-regions';
import {lambdaInitializedKey} from '../../shared/constants';
import {streamToString} from '../../shared/stream-to-string';
import {lambdaLs, lambdaReadFile} from '../helpers/io';
import {ChunkTimingData} from './types';

export const collectChunkInformation = async ({
	bucketName,
	renderId,
	region,
}: {
	bucketName: string;
	renderId: string;
	region: AwsRegion;
}) => {
	const prefix = lambdaInitializedKey(renderId);
	const timingFiles = await lambdaLs({
		bucketName,
		prefix,
		region,
	});
	const timingFileContents = await Promise.all(
		timingFiles.map(async (file) => {
			const contents = await lambdaReadFile({
				bucketName,
				key: file.Key as string,
				region,
			});
			const string = await streamToString(contents);
			return JSON.parse(string) as ChunkTimingData;
		})
	);
	return timingFileContents;
};
