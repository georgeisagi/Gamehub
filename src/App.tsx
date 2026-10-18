import { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Check, 
  X, 
  ShieldCheck, 
  Copy, 
  ExternalLink,
  Package
} from 'lucide-react';
import QRCode from 'qrcode';
import { usePWAInstall } from './usePWAInstall';

export default function App() {
  const [downloadedZip, setDownloadedZip] = useState(false);
  const [downloadedImg, setDownloadedImg] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (currentUrl) {
      QRCode.toDataURL(currentUrl, {
        width: 170,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      }).then(setQrCodeDataUrl).catch(() => {});
    }
  }, [currentUrl]);

  // Direct download of apk.zip (with Android SDK 34 and Gradle)
  const handleDownloadApkZip = () => {
    const link = document.createElement('a');
    link.href = '/apk.zip';
    link.download = 'apk.zip';
    link.click();

    setDownloadedZip(true);
    setTimeout(() => setDownloadedZip(false), 2500);
  };

  // Downloads high-res pure white image
  const handleDownloadImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1920, 1080);

      const link = document.createElement('a');
      link.download = 'fundo-branco.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      setDownloadedImg(true);
      setTimeout(() => setDownloadedImg(false), 2000);
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowInstallModal(true);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-white select-none">
      {/* Botões no canto superior direito */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {/* Baixar apk.zip com SDK e Gradle */}
        <button
          onClick={handleDownloadApkZip}
          className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 active:scale-95 rounded-lg shadow-md transition-all cursor-pointer"
          title="Baixar arquivo apk.zip com Android SDK 34 e Gradle"
        >
          {downloadedZip ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">apk.zip Baixado!</span>
            </>
          ) : (
            <>
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Baixar apk.zip</span>
            </>
          )}
        </button>

        {/* Instalar App nativo no celular (PWA / WebAPK) */}
        {!isInstalled && (
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 active:scale-95 rounded-lg border border-neutral-300 shadow-sm transition-all cursor-pointer"
            title="Instalar nativamente no celular via PWA / WebAPK"
          >
            <Smartphone className="w-4 h-4 text-neutral-700" />
            <span className="hidden sm:inline">Instalar no Celular</span>
          </button>
        )}

        {/* Baixar Imagem Branca */}
        <button
          onClick={handleDownloadImage}
          className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:scale-95 rounded-lg border border-neutral-300 shadow-sm transition-all cursor-pointer"
          title="Baixar imagem branca em alta definição (1920x1080 PNG)"
        >
          {downloadedImg ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Baixado!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-neutral-600" />
              <span>PNG</span>
            </>
          )}
        </button>
      </div>

      {/* Modal de Instalação Nativa */}
      {showInstallModal && (
        <div 
          onClick={() => setShowInstallModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 text-neutral-900 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-neutral-900 text-white rounded-xl">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Instalar Fundo Branco</h3>
                  <p className="text-xs text-neutral-500">Android Nativo & PWA</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Como instalar no Android */}
            <div className="mt-4 space-y-3">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <p className="font-semibold text-neutral-800 text-xs uppercase tracking-wider mb-2">
                  {isIOS ? 'No iPhone / iPad:' : 'Instalação Direta no Celular (Android):'}
                </p>
                {isIOS ? (
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    Toque no botão <strong>Compartilhar</strong> no Safari e selecione <strong>Adicionar à Tela de Início</strong>.
                  </p>
                ) : (
                  <ol className="text-xs text-neutral-700 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Abra este link no <strong>Chrome</strong> do seu celular.</li>
                    <li>Toque nos <strong>3 pontinhos</strong> do navegador.</li>
                    <li>Toque em <strong>"Instalar aplicativo"</strong>.</li>
                  </ol>
                )}
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instala nativamente na tela inicial com suporte offline.</span>
                </div>
              </div>

              {/* QR Code para abrir no celular */}
              {qrCodeDataUrl && (
                <div className="flex flex-col items-center justify-center p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
                  <p className="text-xs font-medium text-neutral-600 mb-2">
                    Abra no celular apontando a câmera:
                  </p>
                  <img 
                    src={qrCodeDataUrl} 
                    alt="QR Code do App" 
                    className="w-36 h-36 rounded-lg border border-neutral-300 bg-white p-1"
                  />
                  <div className="mt-3 flex items-center gap-2 w-full">
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white hover:bg-neutral-100 text-neutral-800 rounded-lg border border-neutral-300 text-xs font-medium shadow-2xs transition-colors cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Link Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-neutral-600" />
                          <span>Copiar Link</span>
                        </>
                      )}
                    </button>
                    <a
                      href={currentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-1.5 bg-white hover:bg-neutral-100 text-neutral-800 rounded-lg border border-neutral-300 text-xs shadow-2xs"
                      title="Abrir em nova aba"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-600" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowInstallModal(false)}
              className="mt-4 w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
