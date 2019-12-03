import HelloSign from 'hellosign-embedded';

export default function initHellosign(clientId, testMode) {
  const testModeData = testMode === 'enabled' ? {
    testMode: true,
    debug: true,
    skipDomainVerification: true,
  } : {};

  return new HelloSign({
    clientId,
    ...testModeData,
  });
}
