package br.com.celebra.convite;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.widget.TextView;
import android.webkit.WebView;
import android.graphics.Color;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final String BASE_URL =
        "https://celebra-convite.vercelsistemas.workers.dev/e/";

    private FrameLayout capaAtual;
    private CountDownTimer contagemCapa;

    private void removerCapa() {
        if (contagemCapa != null) {
            contagemCapa.cancel();
            contagemCapa = null;
        }
        if (capaAtual != null) {
            ViewGroup parent = (ViewGroup) capaAtual.getParent();
            if (parent != null) parent.removeView(capaAtual);
            capaAtual = null;
        }
    }

    @Override
    public void onDestroy() {
        removerCapa();
        super.onDestroy();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        abrirConviteDoIntent(getIntent());
        mostrarCapa();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        abrirConviteDoIntent(intent);
        mostrarCapa();
    }

    private void mostrarCapa() {
        removerCapa();
        final ViewGroup raiz = findViewById(android.R.id.content);
        if (raiz == null) return;

        final FrameLayout capa = new FrameLayout(this);
        capaAtual = capa;
        capa.setClickable(true);
        capa.setBackgroundColor(Color.rgb(242, 211, 200));

        final ImageView imagem = new ImageView(this);
        float proporcaoTela =
                (float) getResources().getDisplayMetrics().heightPixels
                / getResources().getDisplayMetrics().widthPixels;

        imagem.setImageResource(
                proporcaoTela >= 1.9f
                        ? R.drawable.capa_convidado_9x20
                        : R.drawable.capa_convidado
        );
        imagem.setScaleType(ImageView.ScaleType.CENTER_CROP);
        imagem.setAdjustViewBounds(false);

        capa.addView(imagem, new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));

        final TextView carregando = new TextView(this);
        carregando.setText("Carregando convite… 3");
        carregando.setTextColor(Color.rgb(84, 17, 47));
        carregando.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        carregando.setGravity(Gravity.CENTER);
        carregando.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_YES);
        GradientDrawable faixa = new GradientDrawable(
            GradientDrawable.Orientation.LEFT_RIGHT,
            new int[] { Color.rgb(239, 168, 62), Color.rgb(255, 217, 139) }
        );
        faixa.setCornerRadius(48 * getResources().getDisplayMetrics().density);
        faixa.setStroke(2, Color.rgb(255, 229, 175));
        carregando.setBackground(faixa);
        capa.addView(carregando, new FrameLayout.LayoutParams(1, 1));

        raiz.addView(capa, new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));

        capa.post(() -> {
            if (capaAtual != capa || imagem.getDrawable() == null) return;

            float larguraTela = capa.getWidth();
            float alturaTela = capa.getHeight();
            float larguraOriginal = imagem.getDrawable().getIntrinsicWidth();
            float alturaOriginal = imagem.getDrawable().getIntrinsicHeight();
            float escala = Math.max(
                larguraTela / larguraOriginal,
                alturaTela / alturaOriginal
            );

            float larguraImagem = larguraOriginal * escala;
            float alturaImagem = alturaOriginal * escala;
            float inicioX = (larguraTela - larguraImagem) / 2f;
            float inicioY = (alturaTela - alturaImagem) / 2f;

            FrameLayout.LayoutParams posicao = new FrameLayout.LayoutParams(
                (int) (larguraImagem * 0.60f),
                (int) (alturaImagem * 0.09f)
            );
            posicao.leftMargin = (int) (inicioX + larguraImagem * 0.20f);
            posicao.topMargin = (int) (inicioY + alturaImagem * 0.76f);
            carregando.setLayoutParams(posicao);
            float densidade = getResources().getDisplayMetrics().scaledDensity;
            carregando.setTextSize(Math.max(12f, Math.min(20f, posicao.width / (18f * densidade))));

            contagemCapa = new CountDownTimer(3000, 1000) {
                @Override
                public void onTick(long restante) {
                    int segundos = (int) Math.ceil(restante / 1000.0);
                    carregando.setText("Carregando convite… " + segundos);
                }

                @Override
                public void onFinish() {
                    if (capaAtual == capa) removerCapa();
                }
            }.start();
        });

    }

    private void abrirConviteDoIntent(Intent intent) {
        if (intent == null || intent.getData() == null || bridge == null) {
            return;
        }

        Uri uri = intent.getData();

        if (!"celebra".equalsIgnoreCase(uri.getScheme()) ||
            !"convite".equalsIgnoreCase(uri.getHost())) {
            return;
        }

        String codigo = uri.getLastPathSegment();

        if (codigo == null || codigo.trim().isEmpty()) {
            return;
        }

        final String destino = BASE_URL + Uri.encode(codigo.trim());
        final WebView webView = bridge.getWebView();

        if (webView == null) {
            return;
        }

        webView.post(() -> webView.loadUrl(destino));
    }
}
